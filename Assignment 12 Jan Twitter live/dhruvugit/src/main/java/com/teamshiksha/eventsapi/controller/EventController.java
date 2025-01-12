package com.teamshiksha.eventsapi.controller;

import com.teamshiksha.eventsapi.dto.EventUpdateRequest;
import com.teamshiksha.eventsapi.model.Event;
import com.teamshiksha.eventsapi.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Event> getEventBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getBySlug(slug));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String query) {
        return ResponseEntity.ok(eventService.search(query));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> softDeleteEvent(@PathVariable String slug) {
        eventService.softDelete(slug);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{slug}")
    public ResponseEntity<Event> updateEventDescription(
            @PathVariable String slug,
            @RequestBody EventUpdateRequest request) {
        return ResponseEntity.ok(eventService.updateDescription(slug, request.getDescription()));
    }
}