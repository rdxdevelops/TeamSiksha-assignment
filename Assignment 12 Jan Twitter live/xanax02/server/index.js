const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//search by title or des
app.get("/api/events/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const data = await fs.readFile("data.json", "utf-8");
    const events = JSON.parse(data);
    const filteredEvents = events.filter((event) => {
      if (event.deleted) {
        res.status(200).json({ message: "no event found with giving query" });
      }

      const userQuery = query.toLowerCase();
      return (
        event.title.toLowerCase().includes(userQuery) ||
        event.description.toLowerCase().includes(userQuery)
      );
    });

    res.status(200).json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//get event by slug
app.get("/api/events/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await fs.readFile("data.json", "utf-8");
    const events = JSON.parse(data);

    const event = events.find((item) => item.slug === slug && !item.deleted);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
    return;
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
    return;
  }
});

//soft delete
app.delete("/api/events/:slug", async (req, res) => {
  try {
    const data = await fs.readFile("data.json", "utf-8");
    const events = JSON.parse(data);
    const reqEvent = events.findIndex((e) => e.slug === req.params.slug);

    if (reqEvent === -1) {
      return res.status(404).json({ error: "Event not found" });
    }

    events[reqEvent] = { ...events[reqEvent], deleted: true };

    await fs.writeFile("data.json", JSON.stringify(events));

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//update desc
app.patch("/api/events/:slug", async (req, res) => {
  try {
    const { description } = req.body;
    const { slug } = req.params;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const data = await fs.readFile("data.json", "utf-8");
    const events = JSON.parse(data);
    const reqEvent = events.findIndex(
      (item) => item.slug === slug && !item.deleted
    );

    if (reqEvent === -1) {
      return res.status(404).json({ error: "Event not found" });
    }

    events[reqEvent] = { ...events[reqEvent], description };

    await fs.writeFile("data.json", JSON.stringify(events));

    res.json(events[reqEvent]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8000, () => console.log("server started"));
