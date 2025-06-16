package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // مدة صلاحية التوكن (10 ساعات)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    // مفتاح سري لإنشاء التوكن
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // ✅ إنشاء التوكن باستخدام اسم المستخدم
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    // ✅ استخراج اسم المستخدم من التوكن
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ التحقق من صلاحية التوكن
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ استخراج الـ claims (البيانات) من التوكن
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
