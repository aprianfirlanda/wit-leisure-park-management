package middleware

import "github.com/gofiber/fiber/v2"

func RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		userRole := c.Locals("role")
		if userRole == nil {
			return c.SendStatus(fiber.StatusForbidden)
		}

		if userRole != role {
			return c.SendStatus(fiber.StatusForbidden)
		}

		return c.Next()
	}
}
