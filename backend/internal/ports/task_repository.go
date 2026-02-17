package ports

import (
	"context"
	"time"
)

type TaskStatus string

const (
	TaskPending    TaskStatus = "PENDING"
	TaskInProgress TaskStatus = "IN_PROGRESS"
	TaskDone       TaskStatus = "DONE"
)

type TaskDTO struct {
	PublicID    string     `json:"public_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	Status      TaskStatus `json:"status"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	Zookeeper   string     `json:"zookeeper"`
	Animal      *string    `json:"animal,omitempty"`
}

type TaskCreateInput struct {
	PublicID          string
	Title             string
	Description       *string
	ManagerPublicID   string
	ZookeeperPublicID string
	AnimalPublicID    *string
	DueDate           *time.Time
}

type TaskRepository interface {
	Create(ctx context.Context, input TaskCreateInput) (string, error)
	ListByManager(ctx context.Context, managerPublicID string) ([]TaskDTO, error)
	ListByZookeeper(ctx context.Context, zookeeperPublicID string) ([]TaskDTO, error)
	UpdateStatus(ctx context.Context, publicID string, status TaskStatus) error
	Delete(ctx context.Context, publicID string) error
}
