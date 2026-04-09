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

    public AuthController(UserService userService,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();

        if (userService.emailExists(user.getEmail())) {
            response.put("message", "Email already registered!");
            return ResponseEntity.badRequest().body(response);
        }

        // Encrypt password using BCrypt
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {

        Map<String, String> response = new HashMap<>();

        return userService.findByEmail(user.getEmail())
                .map(foundUser -> {

                    if (passwordEncoder.matches(
                            user.getPassword(),
                            foundUser.getPassword())) {

                        String token = jwtUtil.generateToken(foundUser.getEmail());

                        response.put("token", token);
                        response.put("role", foundUser.getRole().toString());

                        // ✅ Added userId here
                        response.put("userId", foundUser.getId().toString());

                        response.put("message", "Login successful!");
                        return ResponseEntity.ok(response);

                    } else {
                        response.put("message", "Invalid password!");
                        return ResponseEntity.badRequest().body(response);
                    }
                })
                .orElseGet(() -> {
                    response.put("message", "User not found!");
                    return ResponseEntity.badRequest().body(response);
                });
    }
}
