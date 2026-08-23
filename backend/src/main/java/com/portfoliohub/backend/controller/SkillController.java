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

import com.portfoliohub.backend.dto.request.SkillRequest;
import com.portfoliohub.backend.dto.response.SkillResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.SkillService;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;
    private final UserRepository userRepository;

    public SkillController(SkillService skillService, UserRepository userRepository) {
        this.skillService = skillService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<SkillResponse> getAll() {
        return skillService.getAll(getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse create(@Valid @RequestBody SkillRequest request) {
        return skillService.create(getCurrentUserId(), request);
    }

    @PutMapping("/{id}")
    public SkillResponse update(@PathVariable UUID id, @Valid @RequestBody SkillRequest request) {
        return skillService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        skillService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(authentication.getName())
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
