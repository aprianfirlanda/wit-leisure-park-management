package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWT(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.SendStatus(fiber.StatusUnauthorized)
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return c.SendStatus(fiber.StatusUnauthorized)
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Locals("user_id", claims["sub"])
		c.Locals("role", claims["role"])

		return c.Next()
	}
}
