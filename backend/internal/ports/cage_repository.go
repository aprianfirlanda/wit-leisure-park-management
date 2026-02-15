package ports

import "context"

type CageRepository interface {
	CodeExists(ctx context.Context, code string) (bool, error)

	Create(ctx context.Context, publicID, code, location string) (string, error)

	List(ctx context.Context) ([]CageDTO, error)

	FindByID(ctx context.Context, publicID string) (CageDTO, error)

	Update(ctx context.Context, publicID, code, location string) error

	Delete(ctx context.Context, publicID string) error
}

type CageDTO struct {
	PublicID string `json:"public_id"`
	Code     string `json:"code"`
	Location string `json:"location"`
}
