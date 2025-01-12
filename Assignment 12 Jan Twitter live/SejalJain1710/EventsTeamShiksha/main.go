package main

import (
	"eventsteamshiksha/utils"
	"eventsteamshiksha/handlers"


	"github.com/gofiber/fiber/v2"
)

func main() {
	utils.LoadEvents()
	app := fiber.New()

	app.Get("/events/get/:slug", handlers.GetEventsBySlug)
	app.Get("/events/search", handlers.SearchEvents)
	app.Delete("/events/delete/:slug", handlers.SoftDeleteEventBySlug)
	app.Patch("/events/update/:slug", handlers.UpdateEventDescription)

	app.Listen(":6000")
}
