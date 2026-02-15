package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com
*/

import (
	"wit-leisure-park/backend/internal/adapters/http/handler"
	"wit-leisure-park/backend/internal/adapters/repository"
	"wit-leisure-park/backend/internal/application"
	"wit-leisure-park/backend/internal/server"

	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Run HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		// --- Repository ---
		userRepo := repository.NewUserRepository(db)

		// --- Service ---
		authService := application.NewAuthService(
			userRepo,
			cfg.JWTSecret,
		)

		// --- Handler ---
		authHandler := handler.NewAuthHandler(log, authService)

		// --- Server ---
		app := server.NewHTTPServer(cfg, log, authHandler)
		app.Start()
	},
}

func init() {
	rootCmd.AddCommand(httpCmd)
}
