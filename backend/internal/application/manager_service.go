package application

import (
	"context"
	"errors"
	"wit-leisure-park/backend/internal/infrastructure/id"

	"wit-leisure-park/backend/internal/ports"

	"golang.org/x/crypto/bcrypt"
)

type ManagerService struct {
	repo  ports.ManagerRepository
	idGen *id.UUIDGenerator
}

func NewManagerService(
	repo ports.ManagerRepository,
	idGen *id.UUIDGenerator,
) *ManagerService {
	return &ManagerService{
		repo:  repo,
		idGen: idGen,
	}
}

func (s *ManagerService) Create(
	ctx context.Context,
	username string,
	password string,
	name string,
) (ports.ManagerDTO, error) {

	exists, err := s.repo.UsernameExists(ctx, username)
	if err != nil {
		return ports.ManagerDTO{}, err
	}
	if exists {
		return ports.ManagerDTO{}, errors.New("username already exists")
	}

	publicID, err := s.idGen.NewID()
	if err != nil {
		return ports.ManagerDTO{}, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return ports.ManagerDTO{}, err
	}

	createdID, err := s.repo.CreateManager(
		ctx,
		username,
		string(hash),
		publicID,
		name,
	)
	if err != nil {
		return ports.ManagerDTO{}, err
	}

	return ports.ManagerDTO{
		PublicID: createdID,
		Username: username,
		Name:     name,
	}, nil
}

func (s *ManagerService) List(ctx context.Context) ([]ports.ManagerDTO, error) {
	return s.repo.ListManagers(ctx)
}

func (s *ManagerService) Update(
	ctx context.Context,
	publicID string,
	name string,
) error {
	return s.repo.UpdateManager(ctx, publicID, name)
}

func (s *ManagerService) Delete(
	ctx context.Context,
	requesterPublicID string,
	targetPublicID string,
) error {

	if requesterPublicID == targetPublicID {
		return errors.New("cannot delete yourself")
	}

	count, err := s.repo.CountManagers(ctx)
	if err != nil {
		return err
	}

	if count <= 1 {
		return errors.New("at least one manager must exist")
	}

	return s.repo.DeleteManager(ctx, targetPublicID)
}
