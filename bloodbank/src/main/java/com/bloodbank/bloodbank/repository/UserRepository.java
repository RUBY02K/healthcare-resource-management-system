package com.bloodbank.bloodbank.repository;
import com.bloodbank.bloodbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// @Repository → Spring ko batata hai
// yeh class database se baat karegi
@Repository

// JpaRepository extend kar rahe hain
// Isme already banee hain common methods:
// save(), findById(), findAll(), delete()
// Humein yeh methods likhne nahi padenge!
public interface UserRepository  extends JpaRepository<User , Long>{
    // Custom method → email se user dhundo
    // Spring automatically query banayega
    // "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);

    // Check karo email already exist karti hai ya nahi
    // Registration ke time kaam aayega
    // "SELECT COUNT(*) FROM users WHERE email = ?"
    boolean existsByEmail(String email);
}
