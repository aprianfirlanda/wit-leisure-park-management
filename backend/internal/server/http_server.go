package server

import (
	"wit-leisure-park/backend/internal/infrastructure/config"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type HTTPServer struct {
	log *logrus.Logger
	cfg *config.Config
}

func NewHTTPServer(cfg *config.Config, log *logrus.Logger) *HTTPServer {
	return &HTTPServer{log: log, cfg: cfg}
}

func (s *HTTPServer) Start() {
	port := s.cfg.AppPort
	if port == "" {
		port = "8080"
	}

	app := fiber.New()

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		s.log.Info("health check called")

		return c.JSON(fiber.Map{
			"status": "OK",
		})
	})

	s.log.Infof("🚀 HTTP server running on port %s", port)

	if err := app.Listen(":" + port); err != nil {
		s.log.Fatal("failed to start server: ", err)
	}
}
