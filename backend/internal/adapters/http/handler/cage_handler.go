package handler

import (
	"wit-leisure-park/backend/internal/application"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type CageHandler struct {
	log     *logrus.Logger
	service *application.CageService
}

func NewCageHandler(
	log *logrus.Logger,
	s *application.CageService,
) *CageHandler {
	return &CageHandler{log: log, service: s}
}

func (h *CageHandler) Create(c *fiber.Ctx) error {
	var req struct {
		Code     string `json:"code"`
		Location string `json:"location"`
	}

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid create cage request body")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	result, err := h.service.Create(
		c.Context(),
		req.Code,
		req.Location,
	)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"code":     req.Code,
			"location": req.Location,
			"error":    err.Error(),
		}).Warn("failed to create cage")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", result.PublicID).
		Info("cage created successfully")

	return c.Status(201).JSON(result)
}

func (h *CageHandler) List(c *fiber.Ctx) error {
	result, err := h.service.List(c.Context())
	if err != nil {
		h.log.Error("failed to list cages: ", err)
		return c.Status(500).JSON(fiber.Map{"error": "internal error"})
	}

	h.log.Info("cage list requested")
	return c.JSON(result)
}

func (h *CageHandler) FindByID(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	result, err := h.service.FindByID(c.Context(), publicID)
	if err != nil {
		h.log.WithField("public_id", publicID).
			Warn("cage not found")

		return c.Status(404).JSON(fiber.Map{
			"error": "cage not found",
		})
	}

	return c.JSON(result)
}

func (h *CageHandler) Update(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	var req struct {
		Code     string `json:"code"`
		Location string `json:"location"`
	}

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid update cage request body")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	err := h.service.Update(
		c.Context(),
		publicID,
		req.Code,
		req.Location,
	)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"public_id": publicID,
			"error":     err.Error(),
		}).Warn("failed to update cage")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", publicID).
		Info("cage updated successfully")

	return c.JSON(fiber.Map{
		"message": "cage updated successfully",
	})
}

func (h *CageHandler) Delete(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	err := h.service.Delete(c.Context(), publicID)
	if err != nil {
		h.log.WithField("public_id", publicID).
			Warn("failed to delete cage")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", publicID).
		Info("cage deleted successfully")

	return c.SendStatus(204)
}
