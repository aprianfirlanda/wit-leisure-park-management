package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com
*/

import (
	"context"
	"time"
	"wit-leisure-park/backend/internal/server"

	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Run HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		var result int
		err := db.QueryRow(ctx, "SELECT 1").Scan(&result)
		if err != nil {
			log.Fatal(err)
		}
		log.Infof("Query success, result: %d", result)

		app := server.NewHTTPServer(cfg, log)
		app.Start()
	},
}

func init() {
	rootCmd.AddCommand(httpCmd)
}
