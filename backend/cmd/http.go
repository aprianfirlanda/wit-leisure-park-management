package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com
*/

import (
	"context"
	"fmt"
	"log"
	"time"
	"wit-leisure-park/backend/internal/server"

	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Run HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		// Create timeout context properly
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var result int
		err := db.QueryRow(ctx, "SELECT 1").Scan(&result)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("Query success, result:", result)

		app := server.NewHTTPServer(cfg)
		app.Start()
	},
}

func init() {
	rootCmd.AddCommand(httpCmd)
}
