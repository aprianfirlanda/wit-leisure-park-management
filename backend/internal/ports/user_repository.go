package ports

import (
	"context"
	"wit-leisure-park/backend/internal/domain"
)

type UserRepository interface {
	FindByUsername(ctx context.Context, username string) (*domain.User, error)
}
