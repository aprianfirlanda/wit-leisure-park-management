package task

import "time"

type Status string

const (
	StatusPending    Status = "PENDING"
	StatusInProgress Status = "IN_PROGRESS"
	StatusDone       Status = "DONE"
)

type Entity struct {
	PublicID    string
	Title       string
	Description string
	ManagerID   string
	ZookeeperID string
	AnimalID    *string
	Status      Status
	DueDate     *time.Time
}
