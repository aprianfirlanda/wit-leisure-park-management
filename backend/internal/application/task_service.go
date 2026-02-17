package application

import (
	"context"
	"time"
	"wit-leisure-park/backend/internal/infrastructure/id"
	"wit-leisure-park/backend/internal/ports"
)

type TaskService struct {
	repo  ports.TaskRepository
	idGen *id.UUIDGenerator
}

func NewTaskService(
	repo ports.TaskRepository,
	idGen *id.UUIDGenerator,
) *TaskService {
	return &TaskService{
		repo:  repo,
		idGen: idGen,
	}
}

func (s *TaskService) Create(
	ctx context.Context,
	title string,
	description *string,
	managerPublicID string,
	zookeeperPublicID string,
	animalPublicID *string,
	dueDate *time.Time,
) (string, error) {

	publicID, err := s.idGen.NewID()
	if err != nil {
		return "", err
	}

	return s.repo.Create(ctx, ports.TaskCreateInput{
		PublicID:          publicID,
		Title:             title,
		Description:       description,
		ManagerPublicID:   managerPublicID,
		ZookeeperPublicID: zookeeperPublicID,
		AnimalPublicID:    animalPublicID,
		DueDate:           dueDate,
	})
}

func (s *TaskService) ListByManager(
	ctx context.Context,
	managerPublicID string,
) ([]ports.TaskDTO, error) {
	return s.repo.ListByManager(ctx, managerPublicID)
}

func (s *TaskService) ListByZookeeper(
	ctx context.Context,
	zookeeperPublicID string,
) ([]ports.TaskDTO, error) {
	return s.repo.ListByZookeeper(ctx, zookeeperPublicID)
}

func (s *TaskService) UpdateStatus(
	ctx context.Context,
	publicID string,
	status ports.TaskStatus,
) error {
	return s.repo.UpdateStatus(ctx, publicID, status)
}

func (s *TaskService) Delete(
	ctx context.Context,
	publicID string,
) error {
	return s.repo.Delete(ctx, publicID)
}
