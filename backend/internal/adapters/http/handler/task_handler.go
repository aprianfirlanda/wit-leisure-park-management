package handler

import (
	"wit-leisure-park/backend/internal/application"
	"wit-leisure-park/backend/internal/ports"
	"wit-leisure-park/backend/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type TaskHandler struct {
	log     *logrus.Logger
	service *application.TaskService
}

func NewTaskHandler(
	log *logrus.Logger,
	s *application.TaskService,
) *TaskHandler {
	return &TaskHandler{
		log:     log,
		service: s,
	}
}

type createTaskRequest struct {
	Title             string  `json:"title"`
	Description       *string `json:"description"`
	ZookeeperPublicID string  `json:"zookeeper_public_id"`
	AnimalPublicID    *string `json:"animal_public_id"`
	DueDate           *string `json:"due_date"`
}

func (h *TaskHandler) Create(c *fiber.Ctx) error {

	var req createTaskRequest
	if err := c.BodyParser(&req); err != nil {
		h.log.WithFields(logrus.Fields{
			"path":   c.Path(),
			"method": c.Method(),
		}).Warn("invalid create task request body")

		return c.Status(400).JSON(fiber.Map{
			"error": "invalid body",
		})
	}

	managerID := c.Locals("user_id").(string)

	h.log.WithFields(logrus.Fields{
		"manager_id": managerID,
		"title":      req.Title,
	}).Info("create task request received")

	parsedDueDate, err := utils.ParseDate(req.DueDate)
	if err != nil {
		h.log.Warn("invalid due date")
		return c.Status(400).JSON(fiber.Map{"error": "invalid due date"})
	}
	publicID, err := h.service.Create(
		c.Context(),
		req.Title,
		req.Description,
		managerID,
		req.ZookeeperPublicID,
		req.AnimalPublicID,
		parsedDueDate,
	)

	if err != nil {
		h.log.WithFields(logrus.Fields{
			"manager_id": managerID,
			"error":      err.Error(),
		}).Warn("failed to create task")

		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	h.log.WithFields(logrus.Fields{
		"task_id":    publicID,
		"manager_id": managerID,
	}).Info("task created successfully")

	return c.Status(201).JSON(fiber.Map{
		"public_id": publicID,
	})
}

func (h *TaskHandler) List(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(string)
	role := c.Locals("role").(string)

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"role":    role,
	}).Info("list tasks request")

	var result []ports.TaskDTO
	var err error

	if role == "MANAGER" {
		result, err = h.service.ListByManager(c.Context(), userID)
	} else {
		result, err = h.service.ListByZookeeper(c.Context(), userID)
	}

	if err != nil {
		h.log.WithFields(logrus.Fields{
			"user_id": userID,
			"error":   err.Error(),
		}).Error("failed to list tasks")

		return c.Status(500).JSON(fiber.Map{
			"error": "internal error",
		})
	}

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"count":   len(result),
	}).Info("tasks listed successfully")

	return c.JSON(result)
}

type updateStatusRequest struct {
	Status ports.TaskStatus `json:"status"`
}

func (h *TaskHandler) UpdateStatus(c *fiber.Ctx) error {

	publicID := c.Params("public_id")
	userID := c.Locals("user_id").(string)

	var req updateStatusRequest
	if err := c.BodyParser(&req); err != nil {
		h.log.WithFields(logrus.Fields{
			"user_id": userID,
			"task_id": publicID,
		}).Warn("invalid update status body")

		return c.Status(400).JSON(fiber.Map{
			"error": "invalid body",
		})
	}

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"task_id": publicID,
		"status":  req.Status,
	}).Info("update task status request")

	err := h.service.UpdateStatus(
		c.Context(),
		publicID,
		req.Status,
	)

	if err != nil {
		h.log.WithFields(logrus.Fields{
			"user_id": userID,
			"task_id": publicID,
			"error":   err.Error(),
		}).Warn("failed to update task status")

		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"task_id": publicID,
	}).Info("task status updated successfully")

	return c.JSON(fiber.Map{
		"message": "task updated successfully",
	})
}

func (h *TaskHandler) Delete(c *fiber.Ctx) error {

	publicID := c.Params("public_id")
	userID := c.Locals("user_id").(string)

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"task_id": publicID,
	}).Info("delete task request")

	err := h.service.Delete(c.Context(), publicID)
	if err != nil {
		h.log.WithFields(logrus.Fields{
			"user_id": userID,
			"task_id": publicID,
			"error":   err.Error(),
		}).Warn("failed to delete task")

		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	h.log.WithFields(logrus.Fields{
		"user_id": userID,
		"task_id": publicID,
	}).Info("task deleted successfully")

	return c.SendStatus(204)
}
