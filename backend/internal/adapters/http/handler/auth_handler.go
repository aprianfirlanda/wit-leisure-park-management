package handler

import (
	"wit-leisure-park/backend/internal/application"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type AuthHandler struct {
	log         *logrus.Logger
	authService *application.AuthService
}

func NewAuthHandler(
	log *logrus.Logger,
	authService *application.AuthService,
) *AuthHandler {
	return &AuthHandler{
		log:         log,
		authService: authService,
	}
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginResponse struct {
	AccessToken string `json:"access_token"`
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req loginRequest

	if err := c.BodyParser(&req); err != nil {
		h.log.Error("invalid login request body")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	token, err := h.authService.Login(
		c.Context(),
		req.Username,
		req.Password,
	)
	if err != nil {
		h.log.Warn("failed login attempt for user: ", req.Username)

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid credentials",
		})
	}

	return c.JSON(loginResponse{
		AccessToken: token,
	})
}
