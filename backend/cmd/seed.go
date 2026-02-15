package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com

*/

import (
	"context"
	"time"
	"wit-leisure-park/backend/internal/infrastructure/id"

	"github.com/jackc/pgx/v5"
	"github.com/spf13/cobra"
	"golang.org/x/crypto/bcrypt"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seed initial data",
	RunE: func(cmd *cobra.Command, args []string) error {
		idGen := id.NewUUIDGenerator()

		return runSeed(idGen)
	},
}

func init() {
	rootCmd.AddCommand(seedCmd)
}

func runSeed(idGen *id.UUIDGenerator) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Info("starting seed process")

	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	password := "password123"

	managerID, err := createManager(ctx, tx, idGen, password)
	if err != nil {
		return err
	}

	err = createZookeeper(ctx, tx, idGen, password, managerID)
	if err != nil {
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	log.Info("seed completed successfully")
	return nil
}

func createManager(
	ctx context.Context,
	tx pgx.Tx,
	idGen *id.UUIDGenerator,
	rawPassword string,
) (int64, error) {

	hashed, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	managerPublicID, err := idGen.NewID()
	if err != nil {
		return 0, err
	}

	var managerUserID int64
	err = tx.QueryRow(ctx, `
		INSERT INTO users (public_id, username, password_hash, role)
		VALUES ($1, $2, $3, 'MANAGER')
		RETURNING id
	`,
		managerPublicID,
		"manager1",
		string(hashed),
	).Scan(&managerUserID)

	if err != nil {
		return 0, err
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO zookeeper_managers (public_id, user_id, name)
		VALUES ($1, $2, $3)
	`,
		managerPublicID,
		managerUserID,
		"Main Manager",
	)

	if err != nil {
		return 0, err
	}

	return managerUserID, nil
}

func createZookeeper(
	ctx context.Context,
	tx pgx.Tx,
	idGen *id.UUIDGenerator,
	rawPassword string,
	managerUserID int64,
) error {

	hashed, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	zookeeperPublicID, err := idGen.NewID()
	if err != nil {
		return err
	}

	var zookeeperUserID int64
	err = tx.QueryRow(ctx, `
		INSERT INTO users (public_id, username, password_hash, role)
		VALUES ($1, $2, $3, 'ZOOKEEPER')
		RETURNING id
	`,
		zookeeperPublicID,
		"zookeeper1",
		string(hashed),
	).Scan(&zookeeperUserID)

	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO zookeepers (public_id, user_id, manager_id, name)
		VALUES ($1, $2, $3, $4)
	`,
		zookeeperPublicID,
		zookeeperUserID,
		managerUserID,
		"Zookeeper One",
	)

	return err
}
