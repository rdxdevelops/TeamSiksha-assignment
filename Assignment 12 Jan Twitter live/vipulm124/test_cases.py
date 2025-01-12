import pytest
from fastapi.testclient import TestClient
from main import app, update_json

client = TestClient(app)

# Sample data for testing
sample_data = [
    {"slug": "event1", "title": "Event 1", "description": "Description 1", "is_deleted": False},
    {"slug": "event2", "title": "Event 2", "description": "Description 2", "is_deleted": False},
    {"slug": "event3", "title": "Event 3", "description": "Description 3", "is_deleted": True}
]

# Helper function to reset the JSON data before each test
def reset_json_data():
    update_json(sample_data)

@pytest.fixture(autouse=True)
def run_around_tests():
    reset_json_data()



def test_get_event_by_slug():
    response = client.get("/get_by_slug?slug=event1")
    assert response.status_code == 200
    assert response.json() == sample_data[0]

    response = client.get("/get_by_slug?slug=event3")
    assert response.status_code == 404


def test_get_events_by_title_or_description():
    response = client.get("/get_by_attributes?searchText=Event")
    assert response.status_code == 200
    assert len(response.json()) == 3

    response = client.get("/get_by_attributes?searchText=Description 4")
    assert response.status_code == 404


def test_delete_event_by_slug():
    response = client.delete("/delete?slug=event1")
    assert response.status_code == 200
    assert response.json() == {"message": "Event deleted successfully"}

    response = client.get("/get_by_slug?slug=event1")
    assert response.status_code == 404


def test_undelete_event_by_slug():
    response = client.patch("/undelete_slug?slug=event3")
    assert response.status_code == 200
    assert response.json() == {"message": "Event undeleted successfully"}

    response = client.get("/get_by_slug?slug=event3")
    assert response.status_code == 200


def test_update_slug_by_description():
    response = client.patch("/update_slug?slug=event1&description=New Description")
    assert response.status_code == 200
    assert response.json() == {"message": "Event description updated successfully"}

    response = client.get("/get_by_slug?slug=event1")
    assert response.status_code == 200
    assert response.json()["description"] == "New Description"