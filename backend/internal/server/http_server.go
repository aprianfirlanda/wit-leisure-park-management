package server

import (
	"fmt"
	"wit-leisure-park/backend/internal/infrastructure/config"

	"github.com/gofiber/fiber/v2"
)

type HTTPServer struct {
	cfg *config.Config
}

func NewHTTPServer(cfg *config.Config) *HTTPServer {
	return &HTTPServer{cfg: cfg}
}

func (s *HTTPServer) Start() {
	port := s.cfg.AppPort
	if port == "" {
		port = "8080"
	}

	app := fiber.New()

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "OK",
		})
	})

	fmt.Println("🚀 HTTP server running on port:", port)

	if err := app.Listen(":" + port); err != nil {
		panic(err)
	}
}
