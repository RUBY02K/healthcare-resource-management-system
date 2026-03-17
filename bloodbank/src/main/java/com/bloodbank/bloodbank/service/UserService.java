package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// @Service → Spring ko batata hai
// yeh class business logic handle karegi
@Service
public class UserService {

    // UserRepository ka object
    // Isse database se baat karenge
    private UserRepository userRepository;

    // Constructor Injection
    // Spring khud UserRepository inject karega
    // Matlab humein manually object nahi banana
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Naya user save karo database mein
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Email se user dhundo
    // Optional → matlab user mil bhi sakta hai
    // aur nahi bhi — null pointer exception nahi aayega
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Check karo email pehle se registered hai ya nahi
    // Registration ke time use hoga
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // Saare users lao
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Id se user dhundo
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
