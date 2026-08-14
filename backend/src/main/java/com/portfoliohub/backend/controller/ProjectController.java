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

import com.portfoliohub.backend.dto.request.ProjectRequest;
import com.portfoliohub.backend.dto.response.ProjectResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(getCurrentUserId(), request);
    }

    @GetMapping
    public List<ProjectResponse> getAll() {
        return projectService.getAll(getCurrentUserId());
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable UUID id) {
        return projectService.getById(getCurrentUserId(), id);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        projectService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
