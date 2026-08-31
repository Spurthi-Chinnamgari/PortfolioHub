package com.portfoliohub.backend.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.portfoliohub.backend.dto.request.SocialLinkRequest;
import com.portfoliohub.backend.dto.response.SocialLinkResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.SocialLinkService;

@RestController
@RequestMapping("/api/social-links")
public class SocialLinkController {

    private final SocialLinkService socialLinkService;
    private final UserRepository userRepository;

    public SocialLinkController(SocialLinkService socialLinkService, UserRepository userRepository) {
        this.socialLinkService = socialLinkService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SocialLinkResponse create(@Valid @RequestBody SocialLinkRequest request) {
        return socialLinkService.create(getCurrentUserId(), request);
    }

    @GetMapping
    public List<SocialLinkResponse> getAll() {
        return socialLinkService.getAll(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public SocialLinkResponse getById(@PathVariable UUID id) {
        return socialLinkService.getById(getCurrentUserId(), id);
    }

    @PutMapping("/{id}")
    public SocialLinkResponse update(@PathVariable UUID id, @Valid @RequestBody SocialLinkRequest request) {
        return socialLinkService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        socialLinkService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
