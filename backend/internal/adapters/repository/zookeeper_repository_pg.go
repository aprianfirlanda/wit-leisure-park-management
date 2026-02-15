package repository

import (
	"context"
	"errors"

	"wit-leisure-park/backend/internal/ports"

	"github.com/jackc/pgx/v5/pgxpool"
)

type zookeeperRepository struct {
	db *pgxpool.Pool
}

func NewZookeeperRepository(db *pgxpool.Pool) ports.ZookeeperRepository {
	return &zookeeperRepository{db: db}
}

func (r *zookeeperRepository) UsernameExists(ctx context.Context, username string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)`,
		username,
	).Scan(&exists)
	return exists, err
}

func (r *zookeeperRepository) Create(
	ctx context.Context,
	username string,
	passwordHash string,
	publicID string,
	name string,
	managerPublicID string,
) (string, error) {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	// find manager internal ID
	var managerID int64
	err = tx.QueryRow(ctx, `
		SELECT id FROM users
		WHERE public_id=$1 AND role='MANAGER'
	`, managerPublicID).Scan(&managerID)
	if err != nil {
		return "", err
	}

	// insert user
	var userID int64
	err = tx.QueryRow(ctx, `
		INSERT INTO users (public_id, username, password_hash, role)
		VALUES ($1,$2,$3,'ZOOKEEPER')
		RETURNING id
	`, publicID, username, passwordHash).Scan(&userID)
	if err != nil {
		return "", err
	}

	// insert profile
	_, err = tx.Exec(ctx, `
		INSERT INTO zookeepers (public_id, user_id, manager_id, name)
		VALUES ($1,$2,$3,$4)
	`, publicID, userID, managerID, name)
	if err != nil {
		return "", err
	}

	return publicID, tx.Commit(ctx)
}

func (r *zookeeperRepository) List(ctx context.Context) ([]ports.ZookeeperDTO, error) {
	rows, err := r.db.Query(ctx, `
		SELECT u.public_id, u.username, z.name
		FROM users u
		JOIN zookeepers z ON z.user_id = u.id
		WHERE u.role = 'ZOOKEEPER'
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []ports.ZookeeperDTO

	for rows.Next() {
		var z ports.ZookeeperDTO
		if err := rows.Scan(&z.PublicID, &z.Username, &z.Name); err != nil {
			return nil, err
		}
		result = append(result, z)
	}

	return result, nil
}

func (r *zookeeperRepository) FindByID(
	ctx context.Context,
	publicID string,
) (ports.ZookeeperDTO, error) {

	var z ports.ZookeeperDTO

	err := r.db.QueryRow(ctx, `
		SELECT u.public_id, u.username, z.name
		FROM users u
		JOIN zookeepers z ON z.user_id = u.id
		WHERE u.public_id = $1 AND u.role = 'ZOOKEEPER'
	`, publicID).Scan(
		&z.PublicID,
		&z.Username,
		&z.Name,
	)

	if err != nil {
		return ports.ZookeeperDTO{}, err
	}

	return z, nil
}

func (r *zookeeperRepository) Update(
	ctx context.Context,
	publicID string,
	name string,
) error {

	cmd, err := r.db.Exec(ctx, `
		UPDATE zookeepers
		SET name = $1
		WHERE public_id = $2
	`, name, publicID)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("zookeeper not found")
	}

	return nil
}

func (r *zookeeperRepository) Delete(
	ctx context.Context,
	publicID string,
) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var userID int64
	err = tx.QueryRow(ctx, `
		SELECT id FROM users
		WHERE public_id = $1 AND role = 'ZOOKEEPER'
	`, publicID).Scan(&userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx,
		`DELETE FROM zookeepers WHERE user_id = $1`,
		userID,
	)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx,
		`DELETE FROM users WHERE id = $1`,
		userID,
	)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}
