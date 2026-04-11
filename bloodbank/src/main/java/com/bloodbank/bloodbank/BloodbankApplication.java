package com.bloodbank.bloodbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BloodbankApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodbankApplication.class, args);
    }

    // CORS configuration
    // React frontend localhost:5173 se
    // Spring Boot localhost:8080 se baat kar sake
    // Bina iske browser request block kar deta hai
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        // React ka URL allow karo
                        .allowedOrigins("http://localhost:5173")
                        // Yeh sab HTTP methods allow karo
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Saare headers allow karo
                        .allowedHeaders("*")
                        // Credentials allow karo → JWT token ke liye
                        .allowCredentials(true);
            }
        };
    }
}