package com.bloodbank.bloodbank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity → Spring ko batata hai yeh class ek database table hai
@Entity

// @Table → database mein table ka naam "users" rakho
// Bina iske table ka naam class name hoga "User"
@Table(name = "users")
public class User {

    // @Id → yeh field primary key hai
    // har row ka unique identifier hoga
    @Id

    // @GeneratedValue → id khud automatically generate hogi
    // 1, 2, 3, 4... badhti rahegi - humein manually set nahi karna
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user ka naam store karega
    private String name;

    // @Column(unique = true) → email duplicate nahi ho sakti
    // ek email = ek account only
    @Column(unique = true)
    private String email;

    // user ka password store karega
    // baad mein isko encrypted karenge
    private String password;

    // @Enumerated(EnumType.STRING) → role database mein
    // "ADMIN", "DONOR", "HOSPITAL" text ki tarah save hoga
    // numbers mein nahi (0, 1, 2)
    @Enumerated(EnumType.STRING)
    private Role role;

    // Default Constructor
    // JPA ko yeh chahiye hota hai
    // Bina iske JPA object nahi bana sakta
    public User() {
    }

    // Parameterized Constructor
    // Jab saari values ek saath deni ho tab use hoga
    // Example: new User(1L, "Rahul", "r@r.com", "pass", Role.DONOR)
    public User(Long id, String name, String email,
                String password, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ===== GETTERS =====
    // Getters = bahar se field ki value padhne ke liye
    // user.getName() → "Rahul" milega

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    // ===== SETTERS =====
    // Setters = bahar se field ki value set karne ke liye
    // user.setName("Rahul") → name = "Rahul" ho jaayega
    // this.name = class ka apna field
    // name = jo bahar se parameter mein aaya

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}