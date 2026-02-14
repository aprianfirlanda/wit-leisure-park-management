package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com
*/

import (
	"wit-leisure-park/backend/internal/server"

	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Run HTTP server",
	Run: func(cmd *cobra.Command, args []string) {
		app := server.NewHTTPServer(cfg)
		app.Start()
	},
}

func init() {
	rootCmd.AddCommand(httpCmd)
}
