package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// UserDetailsService → Spring Security ko batata hai
// user kaise dhundna hai database se
@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Spring Security yeh method khud call karta hai
    // Jab token verify karta hai
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Email se user dhundo
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));

        // Spring Security ka User object banao
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    // Naya user save karo
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Email se user dhundo
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Email exist karti hai ya nahi
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // Saare users lao
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Id se user dhundo
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}