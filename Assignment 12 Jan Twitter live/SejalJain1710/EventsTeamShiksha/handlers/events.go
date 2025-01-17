package handlers

import (
	"eventsteamshiksha/models"
	"eventsteamshiksha/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func GetEventsBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	for _, event := range models.Events  {
		if event.Slug == slug {
			return c.JSON(event)
		}
	}
	return c.Status(404).JSON(fiber.Map{
		"message": "Event not found",
	})
}

func SearchEvents(c *fiber.Ctx) error {
	query := c.Query("query")
	result := make([]models.Event, 0)
	for _, event := range models.Events  {
		if strings.Contains(event.Title, query) || strings.Contains(event.Description, query) {
			result = append(result, event)
		}
	}
	return c.JSON(result)
}

func SoftDeleteEventBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	for i, event := range models.Events  {
		if event.Slug == slug {
			models.Events[i].IsDeleted = true
			utils.SaveImmediately()
			return c.JSON(models.Events[i])
		}
	}
	return c.Status(404).JSON(fiber.Map{
		"message": "Event not found",
	})

}

func UpdateEventDescription(c *fiber.Ctx) error {
    slug := c.Params("slug")
    newDescription := c.FormValue("description")
    for i, event := range models.Events {
        if event.Slug == slug {
            models.Events [i].Description = newDescription
            return c.JSON(models.Events [i])
        }
    }
    return c.Status(404).SendString("Event not found")
}