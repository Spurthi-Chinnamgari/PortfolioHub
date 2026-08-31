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

import com.portfoliohub.backend.dto.request.ExperienceRequest;
import com.portfoliohub.backend.dto.response.ExperienceResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.ExperienceService;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;
    private final UserRepository userRepository;

    public ExperienceController(ExperienceService experienceService, UserRepository userRepository) {
        this.experienceService = experienceService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceResponse create(@Valid @RequestBody ExperienceRequest request) {
        return experienceService.create(getCurrentUserId(), request);
    }

    @GetMapping
    public List<ExperienceResponse> getAll() {
        return experienceService.getAll(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public ExperienceResponse getById(@PathVariable UUID id) {
        return experienceService.getById(getCurrentUserId(), id);
    }

    @PutMapping("/{id}")
    public ExperienceResponse update(@PathVariable UUID id, @Valid @RequestBody ExperienceRequest request) {
        return experienceService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        experienceService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
