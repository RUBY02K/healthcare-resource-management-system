package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.security.JwtUtil;
import com.bloodbank.bloodbank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;
    private JwtUtil jwtUtil;
    private PasswordEncoder passwordEncoder;

    // Constructor injection → Spring khud inject karega
    public AuthController(UserService userService,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // POST → /api/auth/register
    // Naya user register karo
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();

        // Pehle check karo email already exist karti hai?
        if (userService.emailExists(user.getEmail())) {
            response.put("message", "Email already registered!");
            return ResponseEntity.badRequest().body(response);
        }

        // Password plain text nahi rahega
        // BCrypt se encrypt hokar save hoga
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    // POST → /api/auth/login
    // Login karo aur JWT token lo
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();

        return userService.findByEmail(user.getEmail())
                .map(foundUser -> {

                    // BCrypt se password match karo
                    // Plain text vs encrypted compare hoga
                    if (passwordEncoder.matches(
                            user.getPassword(),
                            foundUser.getPassword())) {

                        // Password sahi hai → JWT token generate karo
                        String token = jwtUtil.generateToken(foundUser.getEmail());

                        // Token frontend ko bhejo
                        response.put("token", token);

                        // Role bhejo → ADMIN, DONOR, HOSPITAL
                        // Frontend role ke hisaab se dashboard dikhayega
                        response.put("role", foundUser.getRole().toString());

                        // userId bhejo → frontend mein APIs call karne ke liye use hoga
                        // Jaise donor profile, organ register etc.
                        response.put("userId", foundUser.getId().toString());

                        // User ka naam bhejo → Dashboard mein "Welcome, Rahul" dikhane ke liye
                        response.put("name", foundUser.getName());

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