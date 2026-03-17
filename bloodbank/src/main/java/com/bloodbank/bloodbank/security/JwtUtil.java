package com.bloodbank.bloodbank.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// @Component → Spring ko batata hai
// yeh class ek utility bean hai
// Inject kar sakte hain kahin bhi
@Component
public class JwtUtil {

    // application.properties se secret key lo
    @Value("${jwt.secret}")
    private String secret;

    // application.properties se expiration time lo
    @Value("${jwt.expiration}")
    private long expiration;

    // Secret key ko proper format mein convert karo
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Token generate karo
    // email se token banega
    public String generateToken(String email) {
        return Jwts.builder()
                // Token mein email store karo
                .setSubject(email)
                // Token kab bana
                .setIssuedAt(new Date())
                // Token kab expire hoga
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                // Secret key se sign karo
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Token se email nikalo
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Token valid hai ya nahi check karo
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Token invalid ya expire ho gaya
            return false;
        }
    }
}
