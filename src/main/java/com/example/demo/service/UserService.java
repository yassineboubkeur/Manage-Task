package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Object register(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return new ErrorResponse("Nom d'utilisateur déjà utilisé.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Object login(User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return new ErrorResponse("Nom d'utilisateur incorrect.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new ErrorResponse("Mot de passe incorrect.");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new TokenResponse(token);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setUsername(userDetails.getUsername());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public static class ErrorResponse {
    private final String message;
    public ErrorResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
}

public static class SuccessResponse {
    private final String message;
    public SuccessResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
}

public static class TokenResponse {
    private final String token;
    public TokenResponse(String token) { this.token = token; }
    public String getToken() { return token; }
}

}
