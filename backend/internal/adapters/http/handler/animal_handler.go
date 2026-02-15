package handler

import (
	"wit-leisure-park/backend/internal/application"
	"wit-leisure-park/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type AnimalHandler struct {
	log     *logrus.Logger
	service *application.AnimalService
}

func NewAnimalHandler(
	log *logrus.Logger,
	s *application.AnimalService,
) *AnimalHandler {
	return &AnimalHandler{log: log, service: s}
}

func (h *AnimalHandler) Create(c *fiber.Ctx) error {
	var req struct {
		Name        string  `json:"name"`
		Species     string  `json:"species"`
		CageID      string  `json:"cage_public_id"`
		DateOfBirth *string `json:"date_of_birth"`
	}

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid create animal request body")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	parsedDateOfBirth, err := utils.ParseDate(req.DateOfBirth)
	if err != nil {
		h.log.Warn("invalid date of birth")
		return c.Status(400).JSON(fiber.Map{"error": "invalid date of birth"})
	}
	result, err := h.service.Create(
		c.Context(),
		req.Name,
		req.Species,
		req.CageID,
		parsedDateOfBirth,
	)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"name":    req.Name,
			"species": req.Species,
			"cage_id": req.CageID,
			"error":   err.Error(),
		}).Warn("failed to create animal")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", result.PublicID).
		Info("animal created successfully")

	return c.Status(201).JSON(result)
}

func (h *AnimalHandler) List(c *fiber.Ctx) error {
	result, err := h.service.List(c.Context())
	if err != nil {
		h.log.Error("failed to list animals: ", err)
		return c.Status(500).JSON(fiber.Map{"error": "internal error"})
	}

	h.log.Info("animal list requested")
	return c.JSON(result)
}

func (h *AnimalHandler) FindByID(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	result, err := h.service.FindByID(c.Context(), publicID)
	if err != nil {
		h.log.WithField("public_id", publicID).
			Warn("animal not found")

		return c.Status(404).JSON(fiber.Map{
			"error": "animal not found",
		})
	}

	return c.JSON(result)
}

func (h *AnimalHandler) Update(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	var req struct {
		Name        string  `json:"name"`
		Species     string  `json:"species"`
		CageID      string  `json:"cage_public_id"`
		DateOfBirth *string `json:"date_of_birth"`
	}

	if err := c.BodyParser(&req); err != nil {
		h.log.Warn("invalid update animal request body")
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	parsedDateOfBirth, err := utils.ParseDate(req.DateOfBirth)
	if err != nil {
		h.log.Warn("invalid date of birth")
		return c.Status(400).JSON(fiber.Map{"error": "invalid date of birth"})
	}
	err = h.service.Update(
		c.Context(),
		publicID,
		req.Name,
		req.Species,
		req.CageID,
		parsedDateOfBirth,
	)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"public_id": publicID,
			"error":     err.Error(),
		}).Warn("failed to update animal")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", publicID).
		Info("animal updated successfully")

	return c.JSON(fiber.Map{
		"message": "animal updated successfully",
	})
}

func (h *AnimalHandler) Delete(c *fiber.Ctx) error {
	publicID := c.Params("public_id")

	err := h.service.Delete(c.Context(), publicID)
	if err != nil {
		h.log.WithField("public_id", publicID).
			Warn("failed to delete animal")

		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	h.log.WithField("public_id", publicID).
		Info("animal deleted successfully")

	return c.SendStatus(204)
}
