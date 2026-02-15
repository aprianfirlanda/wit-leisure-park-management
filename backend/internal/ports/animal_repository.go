package ports

import (
	"context"
	"time"
)

type AnimalRepository interface {
	Create(
		ctx context.Context,
		publicID, name, species string,
		cagePublicID string,
		dateOfBirth *time.Time,
	) (string, error)

	List(ctx context.Context) ([]AnimalDTO, error)

	FindByID(ctx context.Context, publicID string) (AnimalDTO, error)

	Update(
		ctx context.Context,
		publicID, name, species, cagePublicID string,
		dateOfBirth *time.Time,
	) error

	Delete(ctx context.Context, publicID string) error
}

type AnimalDTO struct {
	PublicID    string     `json:"public_id"`
	Name        string     `json:"name"`
	Species     string     `json:"species"`
	CageID      string     `json:"cage_public_id"`
	DateOfBirth *time.Time `json:"date_of_birth,omitempty"`
}
