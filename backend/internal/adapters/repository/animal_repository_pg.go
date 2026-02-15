package repository

import (
	"context"
	"errors"

	"wit-leisure-park/backend/internal/ports"

	"github.com/jackc/pgx/v5/pgxpool"
)

type animalRepository struct {
	db *pgxpool.Pool
}

func NewAnimalRepository(db *pgxpool.Pool) ports.AnimalRepository {
	return &animalRepository{db: db}
}

func (r *animalRepository) Create(
	ctx context.Context,
	publicID, name, species string,
	cagePublicID string,
	dateOfBirth *string,
) (string, error) {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var cageID int64
	err = tx.QueryRow(ctx,
		`SELECT id FROM cages WHERE public_id=$1`,
		cagePublicID,
	).Scan(&cageID)
	if err != nil {
		return "", err
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO animals (public_id, name, species, cage_id, date_of_birth)
		VALUES ($1,$2,$3,$4,$5)
	`, publicID, name, species, cageID, dateOfBirth)

	if err != nil {
		return "", err
	}

	return publicID, tx.Commit(ctx)
}

func (r *animalRepository) List(ctx context.Context) ([]ports.AnimalDTO, error) {

	rows, err := r.db.Query(ctx, `
		SELECT a.public_id, a.name, a.species, c.public_id, a.date_of_birth
		FROM animals a
		JOIN cages c ON c.id = a.cage_id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []ports.AnimalDTO

	for rows.Next() {
		var a ports.AnimalDTO
		if err := rows.Scan(
			&a.PublicID,
			&a.Name,
			&a.Species,
			&a.CageID,
			&a.DateOfBirth,
		); err != nil {
			return nil, err
		}
		result = append(result, a)
	}

	return result, nil
}

func (r *animalRepository) FindByID(
	ctx context.Context,
	publicID string,
) (ports.AnimalDTO, error) {

	var a ports.AnimalDTO

	err := r.db.QueryRow(ctx, `
		SELECT a.public_id, a.name, a.species, c.public_id, a.date_of_birth
		FROM animals a
		JOIN cages c ON c.id = a.cage_id
		WHERE a.public_id=$1
	`, publicID).Scan(
		&a.PublicID,
		&a.Name,
		&a.Species,
		&a.CageID,
		&a.DateOfBirth,
	)

	if err != nil {
		return ports.AnimalDTO{}, err
	}

	return a, nil
}

func (r *animalRepository) Update(
	ctx context.Context,
	publicID, name, species, cagePublicID string,
	dateOfBirth *string,
) error {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var cageID int64
	err = tx.QueryRow(ctx,
		`SELECT id FROM cages WHERE public_id=$1`,
		cagePublicID,
	).Scan(&cageID)
	if err != nil {
		return err
	}

	cmd, err := tx.Exec(ctx, `
		UPDATE animals
		SET name=$1,
		    species=$2,
		    cage_id=$3,
		    date_of_birth=$4
		WHERE public_id=$5
	`, name, species, cageID, dateOfBirth, publicID)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("animal not found")
	}

	return tx.Commit(ctx)
}

func (r *animalRepository) Delete(
	ctx context.Context,
	publicID string,
) error {

	cmd, err := r.db.Exec(ctx,
		`DELETE FROM animals WHERE public_id=$1`,
		publicID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("animal not found")
	}

	return nil
}
