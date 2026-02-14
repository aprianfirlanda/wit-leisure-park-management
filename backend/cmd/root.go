package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com

*/

import (
	"os"
	"wit-leisure-park/backend/internal/infrastructure/config"
	"wit-leisure-park/backend/internal/infrastructure/logger"
	"wit-leisure-park/backend/internal/infrastructure/persistence/postgres"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:   "backend",
		Short: "WIT Leisure Park Backend Service",
		Long:  "Backend service for WIT Leisure Park Management System.",
	}
	log *logrus.Logger
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
	log = logger.NewLogger()
	log.Info("starting application bootstrap")

	cfg = config.Load()
	log.Info("configuration loaded")

	var err error
	db, err = postgres.NewPostgres(cfg)
	if err != nil {
		log.Fatal(err)
	}
	log.Info("database connected successfully")
}
