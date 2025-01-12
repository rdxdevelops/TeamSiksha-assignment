package com.teamshiksha.eventsapi.exception;


public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(String message) {
        super(message);
    }
}