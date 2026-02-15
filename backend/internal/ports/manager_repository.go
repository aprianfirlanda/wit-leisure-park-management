package ports

import "context"

type ManagerRepository interface {
	UsernameExists(ctx context.Context, username string) (bool, error)

	CreateManager(
		ctx context.Context,
		username string,
		passwordHash string,
		publicID string,
		name string,
	) (string, error)

	ListManagers(ctx context.Context) ([]ManagerDTO, error)

	FindByPublicID(ctx context.Context, publicID string) (ManagerDTO, error)

	UpdateManager(ctx context.Context, publicID string, name string) error

	DeleteManager(ctx context.Context, publicID string) error

	CountManagers(ctx context.Context) (int, error)
}

type ManagerDTO struct {
	PublicID string `json:"public_id"`
	Username string `json:"username"`
	Name     string `json:"name"`
}
