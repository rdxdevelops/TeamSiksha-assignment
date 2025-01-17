from fastapi import FastAPI, HTTPException, Request
from functools import wraps
import json

app = FastAPI()
json_file_path = "data.json"


def load_json_data() -> list:
    """
    Helper function to load JSON data from the file.
    """
    try:
        with open(json_file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="data.json file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON file")


def update_json(data: list):
    """
    Helper function to update the JSON data in the file.
    """
    with open(json_file_path, 'w') as file:
        json.dump(data, file, indent=4)



@app.get("/get_by_slug")
def get_event_by_slug(slug:str):
    """
    Get an event by slug
    """
    json_data = load_json_data()
    # check if event contains is_deleted propery and is_deleted is False and match slug
    event = next((event for event in json_data if event['slug'] == slug and ('is_deleted' not in event or not event['is_deleted'])), None)
    
    if event:
        return event  # Return the matched event
    else:
        raise HTTPException(status_code=404, detail="Event not found")  # Raise 404 if no match
  

@app.get("/get_by_attributes")
def get_events_by_title_or_description(searchText:str):
    """
    Get events by title or description
    """
    json_data = load_json_data()
    # search event by title or description by matching the search text,also check if event contains is_deleted propery and is_deleted is False 
    events = [event for event in json_data if searchText in event['title'] or searchText in event['description'] and ('is_deleted' not in event or not event['is_deleted'])]

    if events:
        return events  # Return the matched events
    else:
        raise HTTPException(status_code=404, detail="No event found")
    

#soft delete event by slug
@app.delete("/delete")
def delete_event_by_slug(slug:str):
    """
    Delete an event by slug
    """
    json_data = load_json_data()
    event = next((event for event in json_data if event['slug'] == slug), None)
    
    if event:
        event['is_deleted'] = True
        # Write the updated data back to the file
        update_json(json_data)
        return {"message": "Event deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Event not found")




@app.patch('/update_slug')
def update_slug_by_description(slug:str, description:str):
    """
    Update an event's description by slug
    """
    json_data = load_json_data()
    event = next((event for event in json_data if event['slug'] == slug), None)
    
    if event:
        event['description'] = description
        # Write the updated data back to the file
        update_json(json_data)
        return {"message": "Event description updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Event not found")
    


@app.patch('/undelete_slug')
def undelete_event_by_slug(slug:str):
    """
    Undelete an event by slug
    """
    json_data = load_json_data()
    event = next((event for event in json_data if event['slug'] == slug), None)

    if event:
        event['is_deleted'] = False
        # Write the updated data back to the file
        update_json(json_data)
        return {"message": "Event undeleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Event not found")