<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Create a new task
    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Task Added successfully',
            'task' => $task,
        ], 201);
    }

    // Get all tasks for the authenticated user
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->with('user:id,name')->get();

        return response()->json($tasks);
    }

    public function getAllTasks(Request $request)
    {
        // Fetch all tasks with their associated user details
        $tasks = Task::with('user:id,name')->where('is_deleted', 0)->get();

        return response()->json([
            'status' => true,
            'message' => 'All tasks retrieved successfully',
            'tasks' => $tasks,
        ]);
    }

    // Update an existing task
    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Task Updated successfully',
            'task' => $task,
        ]);
    }

    // Delete a task
    public function destroy(Request $request, $id)
    {
        $task = Task::where('user_id', $request->user()->id)->findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    // Admin page Deleting a task (soft delete)
    public function destroyTasks(Request $request, $id)
    {
        $task = Task::find($id);

        // Check if the task exists
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->update(['is_deleted' => 1]);
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
