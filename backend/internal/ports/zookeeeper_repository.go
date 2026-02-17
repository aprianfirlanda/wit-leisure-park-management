package ports

import "context"

type ZookeeperRepository interface {
	UsernameExists(ctx context.Context, username string) (bool, error)

	Create(
		ctx context.Context,
		username string,
		passwordHash string,
		publicID string,
		name string,
		managerPublicID string,
	) (string, error)

	List(ctx context.Context) ([]ZookeeperDTO, error)

	FindByID(ctx context.Context, publicID string) (ZookeeperDTO, error)

	Update(ctx context.Context, publicID string, name string) error

	Delete(ctx context.Context, publicID string) error
}

type ZookeeperDTO struct {
	PublicID    string `json:"public_id"`
	Username    string `json:"username"`
	Name        string `json:"name"`
	ManagerID   string `json:"manager_public_id"`
	ManagerName string `json:"manager_name"`
}
