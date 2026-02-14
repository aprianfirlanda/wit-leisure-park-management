package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com

*/

import (
	"log"
	"os"
	"wit-leisure-park/backend/internal/infrastructure/config"
	"wit-leisure-park/backend/internal/infrastructure/persistence/postgres"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:   "backend",
		Short: "WIT Leisure Park Backend Service",
		Long:  "Backend service for WIT Leisure Park Management System.",
	}
	cfg *config.Config
	db  *pgxpool.Pool
)

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initApp)
}

func initApp() {
	cfg = config.Load()

	var err error
	db, err = postgres.NewPostgres(cfg)
	if err != nil {
		log.Fatal(err)
	}
}
