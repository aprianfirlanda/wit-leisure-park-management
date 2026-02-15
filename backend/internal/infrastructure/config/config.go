package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	AppPort string

	JWTSecret string

	DBHost string
	DBPort string
	DBUser string
	DBPass string
	DBName string
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

		JWTSecret: viper.GetString("JWT_SECRET"),

		DBHost: viper.GetString("DB_HOST"),
		DBPort: viper.GetString("DB_PORT"),
		DBUser: viper.GetString("DB_USER"),
		DBPass: viper.GetString("DB_PASSWORD"),
		DBName: viper.GetString("DB_NAME"),
	}
}
