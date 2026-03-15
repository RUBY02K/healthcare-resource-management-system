package com.bloodbank.bloodbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

// @SpringBootApplication → poora Spring Boot app start karta hai
@SpringBootApplication

// @EntityScan → Spring ko batao entities kahan hain
// Yahan jaake User.java dhundo
@EntityScan(basePackages = "com.bloodbank.bloodbank.entity")
public class BloodbankApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodbankApplication.class, args);
    }
}