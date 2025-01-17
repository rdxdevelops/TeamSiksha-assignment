import fs from "fs";
import path from "path";

interface Event {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  startTime: string;
  endTime: string;
  deleted?: boolean;
}

class Event {
  private events: Event[];

  constructor() {
    const file = path.join(__dirname, "../data/data.json");
    const data = fs.readFileSync(file, "utf-8");
    this.events = JSON.parse(data);
  }

  getEvents(): Event[] {
    return this.events.filter((event) => !event.deleted);
  }

  getEventBySlug(slug: string): Event {
    const event = this.events.find(
      (event) => event.slug === slug && !event.deleted
    );
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  searchEvents(query: string): Event[] {
    const events = this.events.filter(
      (event) =>
        (event.title.includes(query) || event.description.includes(query)) &&
        !event.deleted
    );
    return events;
  }

  softDeleteEvent(slug: string): boolean {
    const event = this.events.find((event) => event.slug === slug);
    if (event) {
      event.deleted = true;
      return true;
    }
    return false;
  }

  updateEventDescription(slug: string, description: string): boolean {
    const event = this.getEventBySlug(slug);
    if (event) {
      event.description = description;
      return true;
    }
    return false;
  }
}

export default new Event();
