from fastapi import FastAPI, HTTPException, Body
import json
from typing import Dict, List
from datetime import datetime
import uvicorn

app = FastAPI()

def load_data() -> List[Dict]:
    """
    Reads and loads data from the JSON file.
    Returns a list of dictionaries containing event data.
    """
    with open('data.json', 'r') as f:
        return json.load(f)

def save_data(data: List[Dict]):
    """
    Saves the modified data back to the JSON file.
    Takes a list of dictionaries and writes them to the file.
    """
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.get("/")
def read_root():
    """
    Root endpoint to verify API is running.
    Returns a welcome message.
    """
    return {"message": "Welcome to the event manager API"}

@app.get("/events/search")
def search_events(query: str):
    """
    Searches events by matching query string in title or description.
    Args:
        query: Search string to match against events
    Returns:
        List of matching events
    """
    data = load_data()
    results = []
    query = query.lower()
    
    for event in data:
        if (query in event.get("title", "").lower() or 
            query in event.get("description", "").lower()):
            results.append(event)
    
    return results

@app.get("/events/{slug}")
def get_event_by_slug(slug: str):
    """
    Retrieves a single event by its slug identifier.
    Args:
        slug: Unique identifier for the event
    Returns:
        Event data if found
    Raises:
        404 if event not found
    """
    data = load_data()
    for event in data:
        if event.get("slug") == slug:
            return event
    raise HTTPException(status_code=404, detail="Event not found")

@app.delete("/events/{slug}")
def soft_delete_event(slug: str):
    """
    Marks an event as deleted without removing it from the database.
    Args:
        slug: Unique identifier for the event to delete
    Returns:
        Success message if deleted
    Raises:
        404 if event not found
    """
    data = load_data()
    for event in data:
        if event.get("slug") == slug:
            event["deleted"] = True
            event["deleted_at"] = datetime.now().isoformat()
            save_data(data)
            return {"message": "Event soft deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Event not found")

@app.put("/events/{slug}/description")
async def update_description(
    slug: str, 
    data: dict = Body(..., example={"description": "New description"})
):
    """
    Updates the description of a specific event.
    Args:
        slug: Unique identifier for the event
        data: Dictionary containing the new description
    Returns:
        Success message if updated
    Raises:
        404 if event not found
    """
    events = load_data()
    for event in events:
        if event.get("slug") == slug:
            event["description"] = data.get("description")
            save_data(events)
            return {"message": "Description updated successfully"}
    
    raise HTTPException(status_code=404, detail="Event not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)