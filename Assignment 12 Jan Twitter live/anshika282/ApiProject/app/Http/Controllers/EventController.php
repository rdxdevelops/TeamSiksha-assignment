<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

class EventController extends Controller
{
    //Get Event by Slug
    public function getEventBySlug($slug){
        try{
            $eventsContent = $this->getEventsContent();
    
            if (isset($eventsContent['error'])) {
                return response()->json($eventsContent, $eventsContent['status']);
            }
    
            $event = collect($eventsContent)->firstWhere('slug', $slug);
    
            if (!$event) {
                return response()->json(['error' => 'Event not found / Not Available'], 404);
            }
    
            return response()->json(['message' => 'Event Found', 'event' => $event], 200);
    
        } catch (Exception $ex) {
            \Log::error('Error occurred in getEventBySlug: ' . $ex->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $ex->getMessage()], 500);
        }
    }

    //Update Description
    public function updateDescription(Request $request,$slug){
        $validateEvent = $request->validate([
            'description' => 'required|string|max:255',
        ]);

        if(!$validateEvent){
            return response()->json(['error' => 'Please add the description which is a text of max 256 chars'], 400);
        }
        
        $eventsContent = $this->getEventsContent();
    
        if (isset($eventsContent['error'])) {
            return response()->json($eventsContent, $eventsContent['status']);
        }

        $event = collect($eventsContent)->firstWhere('slug', $slug);
        if (!$event) {
            return response()->json(['error' => 'Event not found / Not Available'], 404);
        }

        $event['description'] = $request->description;
        $updatedEventsContent = collect($eventsContent)->map(function ($item) use ($event) {
            return $item['slug'] === $event['slug'] ? $event : $item;
        })->toArray();
        $path = storage_path('app/data.json');
        file_put_contents($path, json_encode($updatedEventsContent, JSON_PRETTY_PRINT));
        return response()->json(['message' => 'Description Updated', 'event' => $event], 200);
    }

    //Soft Delete Event
    public function deleteEvent($slug){
        $eventsContent = $this->getEventsContent();
        if (isset($eventsContent['error'])) {
            return response()->json($eventsContent, $eventsContent['status']);
        }

        $event = collect($eventsContent)->firstWhere('slug', $slug);
        if (!$event) {
            return response()->json(['error' => 'Event not found / Not Available'], 404);
        }
        $event['deleted'] = true;
        $updatedEventsContent = collect($eventsContent)->map(function ($item) use ($event) {
            return $item['slug'] === $event['slug'] ? $event : $item;
        })->toArray();

        $path = storage_path('app/data.json');
        file_put_contents($path, json_encode($updatedEventsContent, JSON_PRETTY_PRINT));

        return response()->json(['message' => 'Event Deleted', 'event' => $event], 200);

    }

    //search funtion:
    public function searchEvents(Request $request) {
        $query = $request->input('query');
    
        if (!$query) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }
    
        $eventsContent = $this->getEventsContent();
    
        if (isset($eventsContent['error'])) {
            return response()->json($eventsContent, $eventsContent['status']);
        }
    
        $results = collect($eventsContent)->filter(function ($event) use ($query) {
            return stripos($event['title'], $query) !== false || stripos($event['description'], $query) !== false;
        })->values();
    
        if ($results->isEmpty()) {
            return response()->json(['message' => 'No events found'], 404);
        }
    
        return response()->json(['message' => 'Events found', 'events' => $results], 200);
    }

    //helper funtion to get json data content from storage and validations
    private function getEventsContent() {
        $path = storage_path('app/data.json');
    
        if (!file_exists($path)) {
            return ['error' => 'Cannot connect to the database (Json File)', 'status' => 404];
        }
    
        $eventsContent = file_get_contents($path);
        $eventsContent = json_decode($eventsContent, true);
    
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ['error' => 'Error occurred while json decode', 'status' => 400];
        }

        //show only the non-soft deleted events
        $eventsContent = array_filter($eventsContent, function($event) {
            return empty($event['deleted']);
        });
    
        return $eventsContent;
    }


}
