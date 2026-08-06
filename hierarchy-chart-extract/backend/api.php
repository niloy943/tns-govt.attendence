<?php

use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Organogram Hierarchy Tree Data Route
    Route::get('/employees/hierarchy', [EmployeeController::class, 'hierarchy']);
    
    // General Employee CRUD routes
    Route::apiResource('employees', EmployeeController::class);
});
