package application

import (
	"context"
	"errors"
	"wit-leisure-park/backend/internal/infrastructure/id"

	"wit-leisure-park/backend/internal/ports"

	"golang.org/x/crypto/bcrypt"
)

type ZookeeperService struct {
	repo  ports.ZookeeperRepository
	idGen *id.UUIDGenerator
}

func NewZookeeperService(
	repo ports.ZookeeperRepository,
	idGen *id.UUIDGenerator,
) *ZookeeperService {
	return &ZookeeperService{
		repo:  repo,
		idGen: idGen,
	}
}

func (s *ZookeeperService) Create(
	ctx context.Context,
	username string,
	password string,
	name string,
	managerPublicID string,
) (ports.ZookeeperDTO, error) {

	exists, err := s.repo.UsernameExists(ctx, username)
	if err != nil {
		return ports.ZookeeperDTO{}, err
	}
	if exists {
		return ports.ZookeeperDTO{}, errors.New("username already exists")
	}

	publicID, err := s.idGen.NewID()
	if err != nil {
		return ports.ZookeeperDTO{}, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return ports.ZookeeperDTO{}, err
	}

	id, err := s.repo.Create(
		ctx,
		username,
		string(hash),
		publicID,
		name,
		managerPublicID,
	)
	if err != nil {
		return ports.ZookeeperDTO{}, err
	}

	return ports.ZookeeperDTO{
		PublicID: id,
		Username: username,
		Name:     name,
	}, nil
}

func (s *ZookeeperService) List(ctx context.Context) ([]ports.ZookeeperDTO, error) {
	return s.repo.List(ctx)
}

func (s *ZookeeperService) FindByID(
	ctx context.Context,
	publicID string,
) (ports.ZookeeperDTO, error) {
	return s.repo.FindByID(ctx, publicID)
}

func (s *ZookeeperService) Update(
	ctx context.Context,
	publicID string,
	name string,
) error {
	return s.repo.Update(ctx, publicID, name)
}

func (s *ZookeeperService) Delete(
	ctx context.Context,
	publicID string,
) error {
	return s.repo.Delete(ctx, publicID)
}
