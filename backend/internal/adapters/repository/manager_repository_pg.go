package repository

import (
	"context"
	"errors"

	"wit-leisure-park/backend/internal/ports"

	"github.com/jackc/pgx/v5/pgxpool"
)

type managerRepository struct {
	db *pgxpool.Pool
}

func NewManagerRepository(db *pgxpool.Pool) ports.ManagerRepository {
	return &managerRepository{db: db}
}

func (r *managerRepository) UsernameExists(ctx context.Context, username string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM users WHERE username=$1)`,
		username,
	).Scan(&exists)
	return exists, err
}

func (r *managerRepository) CreateManager(
	ctx context.Context,
	username string,
	passwordHash string,
	publicID string,
	name string,
) (string, error) {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var userID int64
	err = tx.QueryRow(ctx, `
		INSERT INTO users (public_id, username, password_hash, role)
		VALUES ($1,$2,$3,'MANAGER')
		RETURNING id
	`, publicID, username, passwordHash).Scan(&userID)
	if err != nil {
		return "", err
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO zookeeper_managers (public_id, user_id, name)
		VALUES ($1,$2,$3)
	`, publicID, userID, name)
	if err != nil {
		return "", err
	}

	if err := tx.Commit(ctx); err != nil {
		return "", err
	}

	return publicID, nil
}

func (r *managerRepository) ListManagers(ctx context.Context) ([]ports.ManagerDTO, error) {
	rows, err := r.db.Query(ctx, `
		SELECT u.public_id, u.username, m.name
		FROM users u
		JOIN zookeeper_managers m ON m.user_id = u.id
		WHERE u.role = 'MANAGER'
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]ports.ManagerDTO, 0)
	for rows.Next() {
		var m ports.ManagerDTO
		if err := rows.Scan(&m.PublicID, &m.Username, &m.Name); err != nil {
			return nil, err
		}
		result = append(result, m)
	}

	return result, nil
}

func (r *managerRepository) FindByPublicID(
	ctx context.Context,
	publicID string,
) (ports.ManagerDTO, error) {

	var m ports.ManagerDTO

	err := r.db.QueryRow(ctx, `
		SELECT u.public_id, u.username, z.name
		FROM users u
		JOIN zookeeper_managers z ON z.user_id = u.id
		WHERE u.public_id = $1 AND u.role = 'MANAGER'
	`, publicID).Scan(
		&m.PublicID,
		&m.Username,
		&m.Name,
	)

	if err != nil {
		return ports.ManagerDTO{}, err
	}

	return m, nil
}

func (r *managerRepository) UpdateManager(ctx context.Context, publicID string, name string) error {
	cmd, err := r.db.Exec(ctx, `
		UPDATE zookeeper_managers
		SET name = $1
		WHERE public_id = $2
	`, name, publicID)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("manager not found")
	}

	return nil
}

func (r *managerRepository) CountManagers(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRow(ctx,
		`SELECT COUNT(*) FROM users WHERE role='MANAGER'`,
	).Scan(&count)

	return count, err
}

func (r *managerRepository) DeleteManager(ctx context.Context, publicID string) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// get internal id
	var userID int64
	err = tx.QueryRow(ctx, `
		SELECT id FROM users WHERE public_id=$1 AND role='MANAGER'
	`, publicID).Scan(&userID)
	if err != nil {
		return err
	}

	// delete profile first
	_, err = tx.Exec(ctx,
		`DELETE FROM zookeeper_managers WHERE user_id=$1`,
		userID,
	)
	if err != nil {
		return err
	}

	// delete user
	_, err = tx.Exec(ctx,
		`DELETE FROM users WHERE id=$1`,
		userID,
	)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}
