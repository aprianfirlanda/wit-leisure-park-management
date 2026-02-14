package cmd

/*
Copyright © 2026 NAME HERE aprianfirlanda@gmail.com

*/

import (
	"os"
	"wit-leisure-park/backend/internal/config"

	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:   "backend",
		Short: "WIT Leisure Park Backend Service",
		Long:  "Backend service for WIT Leisure Park Management System.",
	}
	cfg *config.Config
)

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {
	cfg = config.Load()
}
