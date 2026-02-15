package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com
*/

import (
	"wit-leisure-park/backend/internal/adapters/http/handler"
	"wit-leisure-park/backend/internal/adapters/repository"
	"wit-leisure-park/backend/internal/application"
	"wit-leisure-park/backend/internal/infrastructure/id"
	"wit-leisure-park/backend/internal/infrastructure/server"

	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Run HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		idGen := id.NewUUIDGenerator()

		// --- Repository ---
		userRepo := repository.NewUserRepository(db)
		managerRepo := repository.NewManagerRepository(db)
		zookeeperRepo := repository.NewZookeeperRepository(db)

		// --- Service ---
		authService := application.NewAuthService(
			userRepo,
			cfg.JWTSecret,
		)
		managerService := application.NewManagerService(managerRepo, idGen)
		zookeeperService := application.NewZookeeperService(zookeeperRepo, idGen)

		// --- Handler ---
		authHandler := handler.NewAuthHandler(log, authService)
		managerHandler := handler.NewManagerHandler(log, managerService)
		zookeeperHandler := handler.NewZookeeperHandler(log, zookeeperService)

		// --- Server ---
		app := server.NewHTTPServer(cfg, log, authHandler, managerHandler, zookeeperHandler)
		app.Start()
	},
}

func init() {
	rootCmd.AddCommand(httpCmd)
}
