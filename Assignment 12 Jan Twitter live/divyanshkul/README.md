# Assignment 12 Jan Twitter Live - github.com/divyanshkul

This document provides details about available endpoints and how to test them using curl commands.

## Setup

1. Start the server:

```bash
uvicorn main:app --reload
```

The server will run at `http://localhost:8000`

## Available Endpoints

### 1. Health Check

Check if the API is running.

```bash
curl -X GET "http://localhost:8000/"
```

Expected response:

```json
{
  "message": "Welcome to the event manager API"
}
```

### 2. Search Events

Search for events by title or description.

```bash
curl -X GET "http://localhost:8000/events/search?query=value"
```

Example response:

```json
[
  {
    "slug": "user-centric-value-added-secured-line",
    "title": "User-centric value-added secured line",
    "description": "Cumque doloribus non illo molestias ullam.",
    "created": "2025-01-09T22:20:51",
    "startTime": "2025-01-06T07:46:51",
    "endTime": "2025-01-06T10:46:51"
  }
]
```

### 3. Get Event by Slug

Retrieve a specific event using its slug.

```bash
curl -X GET "http://localhost:8000/events/user-centric-value-added-secured-line"
```

Example response:

```json
{
  "slug": "user-centric-value-added-secured-line",
  "title": "User-centric value-added secured line",
  "description": "Cumque doloribus non illo molestias ullam.",
  "created": "2025-01-09T22:20:51",
  "startTime": "2025-01-06T07:46:51",
  "endTime": "2025-01-06T10:46:51"
}
```

### 4. Update Event Description

Update the description of a specific event.

```bash
curl -X PUT "http://localhost:8000/events/user-centric-value-added-secured-line/description" \
    -H "Content-Type: application/json" \
    -d '{"description": "This is the updated description"}'
```

Expected response:

```json
{
  "message": "Description updated successfully"
}
```

### 5. Soft Delete Event

Mark an event as deleted.

```bash
curl -X DELETE "http://localhost:8000/events/user-centric-value-added-secured-line"
```

Expected response:

```json
{
  "message": "Event soft deleted successfully"
}
```
