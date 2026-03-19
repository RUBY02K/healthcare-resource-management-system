package com.bloodbank.bloodbank.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration → yeh class Spring ki config class hai
// @EnableWebSecurity → Spring Security enable karo
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // JwtFilter inject karo
    private JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF disable karo
                // REST APIs mein zaroorat nahi hoti
                .csrf(csrf -> csrf.disable())

                // Kon si APIs free hain, kon si secured
                .authorizeHttpRequests(auth -> auth

                        // Yeh APIs bina token ke access ho sakti hain
                        // Register aur Login ke liye token nahi chahiye
                        .requestMatchers("/api/auth/**").permitAll()

                        // /error endpoint free karo
                        // Spring internally /error use karta hai
                        // Agar secured rahega toh 403 aayega
                        .requestMatchers("/error").permitAll()

                        // Baaki sab APIs ke liye token chahiye
                        .anyRequest().authenticated()
                )

                // Session mat banao
                // Har request mein token check hoga
                // JWT stateless hota hai
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Hamara JwtFilter pehle chalega
                // Phir Spring ka default filter chalega
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // BCrypt password encoder bean
    // Register mein password encrypt hoga
    // Login mein encrypted se match hoga
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}