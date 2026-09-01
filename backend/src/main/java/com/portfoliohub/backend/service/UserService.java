package com.portfoliohub.backend.service;

import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.UserRegistrationRequest;
import com.portfoliohub.backend.dto.response.UserResponse;
import com.portfoliohub.backend.entity.User;
import com.portfoliohub.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse register(UserRegistrationRequest request) {
        String email = request.getEmail().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        String username = request.getUsername();
        if (username == null || username.isBlank()) {
            username = createUsernameFromEmail(email);
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User(
                username,
                email,
                passwordHash,
                "USER",
                false
        );

        return toResponse(userRepository.save(user));
    }

    private String createUsernameFromEmail(String email) {
        String localPart = email.substring(0, email.indexOf('@'))
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9._-]", "");
        String baseUsername = localPart.isBlank() ? "user" : localPart;
        baseUsername = baseUsername.substring(0, Math.min(baseUsername.length(), 44));

        String username = baseUsername;
        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
            String suffixText = "-" + suffix++;
            username = baseUsername.substring(0, Math.min(baseUsername.length(), 50 - suffixText.length()))
                    + suffixText;
        }
        return username;
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setVerified(user.isVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
