package server

import (
	"wit-leisure-park/backend/internal/adapters/http/handler"
	"wit-leisure-park/backend/internal/adapters/http/middleware"
	"wit-leisure-park/backend/internal/infrastructure/config"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type HTTPServer struct {
	log            *logrus.Logger
	cfg            *config.Config
	authHandler    *handler.AuthHandler
	managerHandler *handler.ManagerHandler
}

func NewHTTPServer(
	cfg *config.Config,
	log *logrus.Logger, authHandler *handler.AuthHandler,
	managerHandler *handler.ManagerHandler,
) *HTTPServer {
	return &HTTPServer{
		log:            log,
		cfg:            cfg,
		authHandler:    authHandler,
		managerHandler: managerHandler,
	}
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

	// Auth Routes (public)
	auth := app.Group("/auth")
	auth.Post("/login", s.authHandler.Login)

	// Protected API
	api := app.Group("/api",
		middleware.JWT(s.cfg.JWTSecret),
	)

	// Manager routes (JWT + Role)
	manager := api.Group("/managers",
		middleware.RequireRole("MANAGER"),
	)
	manager.Post("/", s.managerHandler.Create)
	manager.Get("/", s.managerHandler.List)
	manager.Get("/:public_id", s.managerHandler.FindByID)
	manager.Put("/:public_id", s.managerHandler.Update)
	manager.Delete("/:public_id", s.managerHandler.Delete)

	s.log.Infof("🚀 HTTP server running on port %s", port)

	if err := app.Listen(":" + port); err != nil {
		s.log.Fatal("failed to start server: ", err)
	}
}
