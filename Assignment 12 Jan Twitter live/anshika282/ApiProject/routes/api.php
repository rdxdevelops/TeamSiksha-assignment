<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/event/{slug}', [EventController::class,'getEventBySlug']);
Route::post('/update-event/{slug}', [EventController::class,'updateDescription']);
Route::delete('/delete-event/{slug}', [EventController::class, 'deleteEvent']);
Route::get('/search-event', [EventController::class, 'searchEvents']);