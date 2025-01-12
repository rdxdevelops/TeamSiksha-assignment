package com.teamshiksha.eventsapi.repository;



import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.teamshiksha.eventsapi.model.Event;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EventRepository {
    private List<Event> events = new ArrayList<>();
    private final ObjectMapper objectMapper;
    private static final String DATA_FILE = "src/main/resources/data.json";

    public EventRepository() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        loadEvents();
    }

    public List<Event> findAll() {
        return events;
    }

    public Optional<Event> findBySlug(String slug) {
        return events.stream()
                .filter(event -> event.getSlug().equals(slug) && !event.isDeleted())
                .findFirst();
    }

    public List<Event> search(String query) {
        String lowercaseQuery = query.toLowerCase();
        return events.stream()
                .filter(event -> !event.isDeleted() &&
                        (event.getTitle().toLowerCase().contains(lowercaseQuery) ||
                                event.getDescription().toLowerCase().contains(lowercaseQuery)))
                .toList();
    }

    public void save() {
        try {
            objectMapper.writeValue(new File(DATA_FILE), events);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save events", e);
        }
    }

    private void loadEvents() {
        try {
            events = objectMapper.readValue(
                    new File(DATA_FILE),
                    new TypeReference<List<Event>>() {}
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to load events", e);
        }
    }
}
