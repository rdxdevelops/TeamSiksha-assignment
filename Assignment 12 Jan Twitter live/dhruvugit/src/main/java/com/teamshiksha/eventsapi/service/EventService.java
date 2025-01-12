package com.teamshiksha.eventsapi.service;

import com.teamshiksha.eventsapi.exception.EventNotFoundException;
import com.teamshiksha.eventsapi.model.Event;
import com.teamshiksha.eventsapi.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event getBySlug(String slug) {
        return eventRepository.findBySlug(slug)
                .orElseThrow(() -> new EventNotFoundException("Event not found with slug: " + slug));
    }

    public List<Event> search(String query) {
        return eventRepository.search(query);
    }

    public void softDelete(String slug) {
        Event event = getBySlug(slug);
        event.setDeleted(true);
        eventRepository.save();
    }

    public Event updateDescription(String slug, String newDescription) {
        Event event = getBySlug(slug);
        event.setDescription(newDescription);
        eventRepository.save();
        return event;
    }
}