package application

import (
	"context"
	"errors"
	"wit-leisure-park/backend/internal/infrastructure/id"

	"wit-leisure-park/backend/internal/ports"
)

type CageService struct {
	repo  ports.CageRepository
	idGen *id.UUIDGenerator
}

func NewCageService(
	repo ports.CageRepository,
	idGen *id.UUIDGenerator,
) *CageService {
	return &CageService{repo: repo, idGen: idGen}
}

func (s *CageService) Create(
	ctx context.Context,
	code string,
	location string,
) (ports.CageDTO, error) {

	exists, err := s.repo.CodeExists(ctx, code)
	if err != nil {
		return ports.CageDTO{}, err
	}
	if exists {
		return ports.CageDTO{}, errors.New("cage code already exists")
	}

	publicID, err := s.idGen.NewID()
	if err != nil {
		return ports.CageDTO{}, err
	}

	id, err := s.repo.Create(ctx, publicID, code, location)
	if err != nil {
		return ports.CageDTO{}, err
	}

	return ports.CageDTO{
		PublicID: id,
		Code:     code,
		Location: location,
	}, nil
}

func (s *CageService) List(ctx context.Context) ([]ports.CageDTO, error) {
	return s.repo.List(ctx)
}

func (s *CageService) FindByID(
	ctx context.Context,
	publicID string,
) (ports.CageDTO, error) {
	return s.repo.FindByID(ctx, publicID)
}

func (s *CageService) Update(
	ctx context.Context,
	publicID, code, location string,
) error {

	exists, err := s.repo.CodeExists(ctx, code)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("cage code already exists")
	}

	return s.repo.Update(ctx, publicID, code, location)
}

func (s *CageService) Delete(
	ctx context.Context,
	publicID string,
) error {
	return s.repo.Delete(ctx, publicID)
}
