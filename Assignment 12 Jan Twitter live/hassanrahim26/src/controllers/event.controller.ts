import { Request, Response } from "express";
import Event from "../models/event.model";

export const getEventBySlug = (req: Request, res: Response) => {
  const { slug } = req.params;
  const event = Event.getEventBySlug(slug);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
};

export const searchEvents = (req: Request, res: Response): void => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    res.json(Event.getEvents());
    return;
  }
  const results = Event.searchEvents(query);
  res.json(results);
};

export const softDeleteEvent = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const success = Event.softDeleteEvent(slug);
  if (success) {
    res.json({ message: "Event soft deleted" });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
};

export const updateEventDescription = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const { description } = req.body;
  if (!description) {
    res.status(400).json({ message: "Description is required" });
    return;
  }
  const success = Event.updateEventDescription(slug, description);
  if (success) {
    res.json({ message: "Event description updated" });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
};
