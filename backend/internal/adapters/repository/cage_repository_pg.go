package repository

import (
	"context"
	"errors"

	"wit-leisure-park/backend/internal/ports"

	"github.com/jackc/pgx/v5/pgxpool"
)

type cageRepository struct {
	db *pgxpool.Pool
}

func NewCageRepository(db *pgxpool.Pool) ports.CageRepository {
	return &cageRepository{db: db}
}

func (r *cageRepository) CodeExists(ctx context.Context, code string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM cages WHERE code=$1)`,
		code,
	).Scan(&exists)
	return exists, err
}

func (r *cageRepository) Create(
	ctx context.Context,
	publicID, code, location string,
) (string, error) {

	_, err := r.db.Exec(ctx, `
		INSERT INTO cages (public_id, code, location)
		VALUES ($1,$2,$3)
	`, publicID, code, location)

	if err != nil {
		return "", err
	}

	return publicID, nil
}

func (r *cageRepository) List(ctx context.Context) ([]ports.CageDTO, error) {

	rows, err := r.db.Query(ctx, `
		SELECT public_id, code, location
		FROM cages
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]ports.CageDTO, 0)

	for rows.Next() {
		var c ports.CageDTO
		if err := rows.Scan(&c.PublicID, &c.Code, &c.Location); err != nil {
			return nil, err
		}
		result = append(result, c)
	}

	return result, nil
}

func (r *cageRepository) FindByID(
	ctx context.Context,
	publicID string,
) (ports.CageDTO, error) {

	var c ports.CageDTO

	err := r.db.QueryRow(ctx, `
		SELECT public_id, code, location
		FROM cages
		WHERE public_id=$1
	`, publicID).Scan(
		&c.PublicID,
		&c.Code,
		&c.Location,
	)

	if err != nil {
		return ports.CageDTO{}, err
	}

	return c, nil
}

func (r *cageRepository) Update(
	ctx context.Context,
	publicID, code, location string,
) error {

	cmd, err := r.db.Exec(ctx, `
		UPDATE cages
		SET code=$1, location=$2
		WHERE public_id=$3
	`, code, location, publicID)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("cage not found")
	}

	return nil
}

func (r *cageRepository) Delete(
	ctx context.Context,
	publicID string,
) error {

	cmd, err := r.db.Exec(ctx,
		`DELETE FROM cages WHERE public_id=$1`,
		publicID,
	)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("cage not found")
	}

	return nil
}
