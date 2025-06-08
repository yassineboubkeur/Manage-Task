package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // إلغاء CSRF
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/register","/api/login","/api/tasks").permitAll() // 🔓 السماح بدون auth
                .anyRequest().authenticated() // 🛡️ أي حاجة أخرى تحتاج auth
            )
            .httpBasic(Customizer.withDefaults()) // ضروري باش تكون واضحة للـ Postman

            // ✅ اختياري ولكن مفيد
            .formLogin(form -> form.disable())
            .logout(logout -> logout.disable());

        return http.build();
    }

    // ✅ Bean ديال PasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
