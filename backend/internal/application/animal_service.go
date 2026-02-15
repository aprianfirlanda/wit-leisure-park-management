package application

import (
	"context"
	"time"
	"wit-leisure-park/backend/internal/infrastructure/id"

	"wit-leisure-park/backend/internal/ports"
)

type AnimalService struct {
	repo  ports.AnimalRepository
	idGen *id.UUIDGenerator
}

func NewAnimalService(
	repo ports.AnimalRepository,
	idGen *id.UUIDGenerator,
) *AnimalService {
	return &AnimalService{repo: repo, idGen: idGen}
}

func (s *AnimalService) Create(
	ctx context.Context,
	name, species, cagePublicID string,
	dateOfBirth *time.Time,
) (ports.AnimalDTO, error) {

	publicID, err := s.idGen.NewID()
	if err != nil {
		return ports.AnimalDTO{}, err
	}

	animalID, err := s.repo.Create(
		ctx,
		publicID,
		name,
		species,
		cagePublicID,
		dateOfBirth,
	)
	if err != nil {
		return ports.AnimalDTO{}, err
	}

	return ports.AnimalDTO{
		PublicID:    animalID,
		Name:        name,
		Species:     species,
		CageID:      cagePublicID,
		DateOfBirth: dateOfBirth,
	}, nil
}

func (s *AnimalService) List(ctx context.Context) ([]ports.AnimalDTO, error) {
	return s.repo.List(ctx)
}

func (s *AnimalService) FindByID(
	ctx context.Context,
	publicID string,
) (ports.AnimalDTO, error) {
	return s.repo.FindByID(ctx, publicID)
}

func (s *AnimalService) Update(
	ctx context.Context,
	publicID, name, species, cagePublicID string,
	dateOfBirth *time.Time,
) error {
	return s.repo.Update(ctx, publicID, name, species, cagePublicID, dateOfBirth)
}

func (s *AnimalService) Delete(
	ctx context.Context,
	publicID string,
) error {
	return s.repo.Delete(ctx, publicID)
}
