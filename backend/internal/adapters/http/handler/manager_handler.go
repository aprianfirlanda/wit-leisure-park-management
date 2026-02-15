package handler

import (
	"wit-leisure-park/backend/internal/application"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type ManagerHandler struct {
	log     *logrus.Logger
	service *application.ManagerService
}

func NewManagerHandler(log *logrus.Logger, managerService *application.ManagerService) *ManagerHandler {
	return &ManagerHandler{log: log, service: managerService}
}

type createManagerRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

func (h *ManagerHandler) Create(c *fiber.Ctx) error {
	var req createManagerRequest

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid create manager request body")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	result, err := h.service.Create(
		c.Context(),
		req.Username,
		req.Password,
		req.Name,
	)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"username": req.Username,
			"error":    err.Error(),
		}).Warn("failed to create manager")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", result.PublicID).
		Info("manager created successfully")

	return c.Status(201).JSON(result)
}

func (h *ManagerHandler) List(c *fiber.Ctx) error {
	result, err := h.service.List(c.Context())
	if err != nil {
		h.log.Error("failed to list managers: ", err)
		return c.Status(500).JSON(fiber.Map{"error": "internal error"})
	}

	return c.JSON(result)
}

func (h *ManagerHandler) Update(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	var req struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid update manager request")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	err := h.service.Update(c.Context(), publicID, req.Name)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"public_id": publicID,
			"error":     err.Error(),
		}).Warn("failed to update manager")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", publicID).
		Info("manager updated successfully")

	return c.JSON(fiber.Map{"message": "manager updated successfully"})
}

func (h *ManagerHandler) Delete(c *fiber.Ctx) error {
	targetID := c.Params("public_id")

	requesterID, ok := c.Locals("user_id").(string)
	if !ok {
		h.log.Error("missing requester id in context")
		return c.SendStatus(401)
	}

	err := h.service.Delete(
		c.Context(),
		requesterID,
		targetID,
	)

	if err != nil {
		h.log.WithFields(logrus.Fields{
			"requester": requesterID,
			"target":    targetID,
			"error":     err.Error(),
		}).Warn("failed to delete manager")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithFields(logrus.Fields{
		"requester": requesterID,
		"target":    targetID,
	}).Info("manager deleted successfully")

	return c.SendStatus(204)
}
