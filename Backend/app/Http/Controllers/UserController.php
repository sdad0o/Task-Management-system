<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ],
            [
                // Custom messages
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a valid string.',
                'name.max' => 'The name may not be greater than 255 characters.',

                'email.required' => 'The email field is required.',
                'email.email' => 'Please provide a valid email address.',
                'email.unique' => 'This email is already taken. Please choose another.',
                'email.max' => 'The email may not be greater than 255 characters.',

                'password.required' => 'The password field is required.',
                'password.confirmed' => 'Password confirmation does not match.',
                'password.min' => 'The password must be at least 8 characters long.',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user', // Default role is 'user'
        ]);

        $token = $user->createToken('myToken')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
             'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // Validation for login
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Check if password matches
            if (Hash::check($request->password, $user->password)) {
                // Create token
                $token = $user->createToken('myToken')->plainTextToken;

                return response()->json([
                    'status' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'role' => $user->role,
                    ],
                ]);
            }
            return response()->json([
                'status' => false,
                'message' => 'Invalid Password'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Invalid login credentials'
        ]);
    }

    // Fetch authenticated user details
    public function getUser(Request $request)
    {
        return response()->json($request->user());
    }
}
