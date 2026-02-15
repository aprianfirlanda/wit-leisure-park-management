package handler

import (
	"wit-leisure-park/backend/internal/application"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type ZookeeperHandler struct {
	log     *logrus.Logger
	service *application.ZookeeperService
}

func NewZookeeperHandler(
	log *logrus.Logger,
	s *application.ZookeeperService,
) *ZookeeperHandler {
	return &ZookeeperHandler{
		log:     log,
		service: s,
	}
}

type createZookeeperRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

func (h *ZookeeperHandler) Create(c *fiber.Ctx) error {
	var req createZookeeperRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	managerID := c.Locals("user_id").(string)

	result, err := h.service.Create(
		c.Context(),
		req.Username,
		req.Password,
		req.Name,
		managerID,
	)
	if err != nil {
		h.log.Warn(err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(result)
}

func (h *ZookeeperHandler) List(c *fiber.Ctx) error {
	result, err := h.service.List(c.Context())
	if err != nil {
		h.log.Error(err)
		return c.Status(500).JSON(fiber.Map{"error": "internal error"})
	}
	return c.JSON(result)
}

func (h *ZookeeperHandler) FindByID(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	result, err := h.service.FindByID(c.Context(), publicID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "zookeeper not found",
		})
	}

	return c.JSON(result)
}

func (h *ZookeeperHandler) Update(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	var req struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	err := h.service.Update(c.Context(), publicID, req.Name)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "zookeeper updated successfully",
	})
}

func (h *ZookeeperHandler) Delete(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	err := h.service.Delete(c.Context(), publicID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(204)
}
