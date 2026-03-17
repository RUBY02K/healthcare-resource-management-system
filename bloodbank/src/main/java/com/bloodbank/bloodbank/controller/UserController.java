package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

// @RestController → yeh class API requests handle karegi
// Har method ka result automatically JSON mein convert hoga
@RestController

// @RequestMapping → is controller ki sabhi APIs
// "/api/users" se shuru hongi
// Example → /api/users/all
//         → /api/users/save
@RequestMapping("/api/users")
public class UserController {

    // UserService ka object
    // Isse business logic call karenge
    private UserService userService;

    // Constructor Injection
    // Spring khud UserService inject karega
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // POST → /api/users/save
    // Naya user save karo
    // @RequestBody → JSON body se User object banega
    @PostMapping("/save")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // GET → /api/users/all
    // Saare users lao
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // GET → /api/users/1
    // Id se user dhundo
    // @PathVariable → URL se id lega
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
