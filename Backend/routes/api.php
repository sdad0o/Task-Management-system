<?php

use App\Models\User;
use App\Notifications\AdminNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;

// Public Routes (doesn't need authentication)
Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('user', [UserController::class, 'getUser']);

    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::post('tasks/create', [TaskController::class,'create']);
    Route::get('/admin/tasks' , [TaskController::class,'getAllTasks']);
    Route::delete('/admin/tasks/{id}' , [TaskController::class,'destroyTasks']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/admin/send-notification', function (Request $request) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'message' => 'required|string|max:255',
    ]);

    $user = User::find($request->user_id);
    $user->notify(new AdminNotification($request->message));

    return response()->json(['message' => 'Notification sent successfully']);
});
