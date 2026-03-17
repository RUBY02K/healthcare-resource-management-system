package com.bloodbank.bloodbank.security;

import com.bloodbank.bloodbank.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// @Component → Spring bean hai
// OncePerRequestFilter → har request mein ek baar chalega
@Component
public class JwtFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private UserService userService;

    public JwtFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Request ke header se Authorization nikalo
        // Header kuch aisa hoga →
        // "Bearer eyJhbGciOiJIUzI1NiJ9..."
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        // Header hai aur "Bearer " se shuru hota hai?
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // "Bearer " hatao → sirf token lo
            token = authHeader.substring(7);
            // Token se email nikalo
            email = jwtUtil.getEmailFromToken(token);
        }

        // Final variable banao lambda ke liye
        final String finalEmail = email;
        final String finalToken = token;

        // Email mili aur abhi authentication nahi hui?
        if (finalEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Token valid hai?
            if (jwtUtil.validateToken(finalToken)) {

                // User ki role lo database se
                userService.findByEmail(finalEmail).ifPresent(user -> {

                    // Role set karo
                    String role = "ROLE_" + user.getRole().toString();

                    // Authentication object banao
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    finalEmail,
                                    null,
                                    List.of(new SimpleGrantedAuthority(role))
                            );

                    // Security context mein set karo
                    // Matlab → "Yeh user authenticated hai"
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                });
            }
        }

        // Aage jaane do request ko
        filterChain.doFilter(request, response);
    }
}