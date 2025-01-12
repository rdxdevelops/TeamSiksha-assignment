package com.teamshiksha.eventsapi.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEventNotFoundException(EventNotFoundException e) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse(404, e.getMessage()));
    }
}
