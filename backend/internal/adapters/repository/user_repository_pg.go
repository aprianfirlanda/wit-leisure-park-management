package repository

import (
	"context"
	"errors"
	"wit-leisure-park/backend/internal/ports"

	"wit-leisure-park/backend/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type userRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) ports.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByUsername(ctx context.Context, username string) (*domain.User, error) {
	query := `
		SELECT id, public_id, username, password_hash, role
		FROM users
		WHERE username = $1
	`

	row := r.db.QueryRow(ctx, query, username)

	var user domain.User
	err := row.Scan(
		&user.ID,
		&user.PublicID,
		&user.Username,
		&user.PasswordHash,
		&user.Role,
	)

	if err != nil {
		return nil, errors.New("user not found")
	}

	return &user, nil
}
