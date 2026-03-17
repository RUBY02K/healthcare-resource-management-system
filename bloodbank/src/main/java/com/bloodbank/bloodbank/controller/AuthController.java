package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.security.JwtUtil;
import com.bloodbank.bloodbank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // UserService → user dhundne ke liye
    private UserService userService;

    // JwtUtil → token banane ke liye
    private JwtUtil jwtUtil;

    // Constructor injection
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // POST → /api/auth/register
    // Naya user register karo
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        // Response store karne ke liye map
        Map<String, String> response = new HashMap<>();

        // Pehle check karo email already exist karti hai?
        if (userService.emailExists(user.getEmail())) {
            response.put("message", "Email already registered!");
            return ResponseEntity.badRequest().body(response);
        }

        // User save karo
        userService.saveUser(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    // POST → /api/auth/login
    // Login karo aur JWT token lo
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();

        // Email se user dhundo database mein
        return userService.findByEmail(user.getEmail())
                .map(foundUser -> {
                    // Password match karo
                    if (foundUser.getPassword().equals(user.getPassword())) {
                        // Password sahi hai → token banao
                        String token = jwtUtil.generateToken(foundUser.getEmail());
                        response.put("token", token);
                        response.put("role", foundUser.getRole().toString());
                        response.put("message", "Login successful!");
                        return ResponseEntity.ok(response);
                    } else {
                        // Password galat hai
                        response.put("message", "Invalid password!");
                        return ResponseEntity.badRequest().body(response);
                    }
                })
                .orElseGet(() -> {
                    // Email exist nahi karti
                    response.put("message", "User not found!");
                    return ResponseEntity.badRequest().body(response);
                });
    }
}