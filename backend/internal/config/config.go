package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	AppPort string
}

func Load() *Config {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		AppPort: viper.GetString("APP_PORT"),
	}
}
