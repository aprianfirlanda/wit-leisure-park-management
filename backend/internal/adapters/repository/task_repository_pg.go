package repository

import (
	"context"
	"errors"
	"wit-leisure-park/backend/internal/ports"

	"github.com/jackc/pgx/v5/pgxpool"
)

type taskRepository struct {
	db *pgxpool.Pool
}

func NewTaskRepository(db *pgxpool.Pool) ports.TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(
	ctx context.Context,
	input ports.TaskCreateInput,
) (string, error) {

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	var managerID int64
	err = tx.QueryRow(ctx,
		`SELECT id FROM users WHERE public_id=$1 AND role='MANAGER'`,
		input.ManagerPublicID,
	).Scan(&managerID)
	if err != nil {
		return "", err
	}

	var zookeeperID int64
	err = tx.QueryRow(ctx,
		`SELECT id FROM users WHERE public_id=$1 AND role='ZOOKEEPER'`,
		input.ZookeeperPublicID,
	).Scan(&zookeeperID)
	if err != nil {
		return "", err
	}

	var animalID *int64
	if input.AnimalPublicID != nil {
		var id int64
		err = tx.QueryRow(ctx,
			`SELECT id FROM animals WHERE public_id=$1`,
			*input.AnimalPublicID,
		).Scan(&id)
		if err != nil {
			return "", err
		}
		animalID = &id
	}

	_, err = tx.Exec(ctx,
		`INSERT INTO tasks
		(public_id,title,description,manager_id,zookeeper_id,animal_id,due_date)
		VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		input.PublicID,
		input.Title,
		input.Description,
		managerID,
		zookeeperID,
		animalID,
		input.DueDate,
	)
	if err != nil {
		return "", err
	}

	return input.PublicID, tx.Commit(ctx)
}

func (r *taskRepository) ListByManager(
	ctx context.Context,
	managerPublicID string,
) ([]ports.TaskDTO, error) {

	rows, err := r.db.Query(ctx, `
		SELECT 
			t.public_id,
			t.title,
			t.description,
			t.status,
			t.due_date,
			u.username,
			a.name
		FROM tasks t
		JOIN users u ON u.id = t.zookeeper_id
		LEFT JOIN animals a ON a.id = t.animal_id
		JOIN users m ON m.id = t.manager_id
		WHERE m.public_id = $1
	`, managerPublicID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := []ports.TaskDTO{}

	for rows.Next() {
		var t ports.TaskDTO
		if err := rows.Scan(
			&t.PublicID,
			&t.Title,
			&t.Description,
			&t.Status,
			&t.DueDate,
			&t.Zookeeper,
			&t.Animal,
		); err != nil {
			return nil, err
		}
		result = append(result, t)
	}

	return result, nil
}

func (r *taskRepository) ListByZookeeper(
	ctx context.Context,
	zookeeperPublicID string,
) ([]ports.TaskDTO, error) {

	rows, err := r.db.Query(ctx, `
		SELECT 
			t.public_id,
			t.title,
			t.description,
			t.status,
			t.due_date,
			u.username,
			a.name
		FROM tasks t
		JOIN users u ON u.id = t.zookeeper_id
		LEFT JOIN animals a ON a.id = t.animal_id
		WHERE u.public_id = $1
	`, zookeeperPublicID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := []ports.TaskDTO{}

	for rows.Next() {
		var t ports.TaskDTO
		if err := rows.Scan(
			&t.PublicID,
			&t.Title,
			&t.Description,
			&t.Status,
			&t.DueDate,
			&t.Zookeeper,
			&t.Animal,
		); err != nil {
			return nil, err
		}
		result = append(result, t)
	}

	return result, nil
}

func (r *taskRepository) UpdateStatus(
	ctx context.Context,
	publicID string,
	status ports.TaskStatus,
) error {

	cmd, err := r.db.Exec(ctx,
		`UPDATE tasks SET status=$1 WHERE public_id=$2`,
		status,
		publicID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("task not found")
	}

	return nil
}

func (r *taskRepository) Delete(
	ctx context.Context,
	publicID string,
) error {

	cmd, err := r.db.Exec(ctx,
		`DELETE FROM tasks WHERE public_id=$1`,
		publicID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("task not found")
	}

	return nil
}
