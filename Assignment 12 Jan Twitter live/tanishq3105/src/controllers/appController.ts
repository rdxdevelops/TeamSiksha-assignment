import { Request, Response, RequestHandler } from 'express';
import events from '../../data.json';

interface Params {
  slug: string;
}

interface Event {
  slug: string;
  title: string;
  description: string;
  created: string;
  startTime: string;
  endTime: string;
  deleted?: boolean;
}

class AppController {
  static SearchEvents: RequestHandler = (req, res): void => {
    const { query } = req.query;

    if (Array.isArray(query) || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query must be a string' });
      return;
    }

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const results = (events as Event[]).filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      res.status(404).json({ error: 'No events found' });
      return;
    }

    res.json(results);
    return;
  };

  static RetrieveEvents: RequestHandler = (req, res): void => {
    const activeEvents = (events as Event[]).filter((e) => !e.deleted);
    res.json(activeEvents);
    return;
  };

  static UpdateEventDescription: RequestHandler<Params> = (req, res): void => {
    const { slug } = req.params;
    const { description } = req.body;
    const event = (events as Event[]).find((e) => e.slug === slug);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    event.description = description;
    res.json({ message: 'Event description updated', event });
    return;
  };

  static SoftDeleteEvent: RequestHandler<Params> = (req, res): void => {
    const { slug } = req.params;
    const event = (events as Event[]).find((e) => e.slug === slug);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    event.deleted = true;
    res.json({ message: 'Event marked as deleted', event });
    return;
  };

  RetriveDataBySlug: RequestHandler<Params> = (req, res): void => {
    const { slug } = req.params;
    const event = (events as Event[]).find((e) => e.slug === slug);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
    return;
  };
}

export default AppController;
