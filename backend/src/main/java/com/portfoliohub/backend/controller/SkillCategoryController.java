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

import com.portfoliohub.backend.dto.request.SkillCategoryRequest;
import com.portfoliohub.backend.dto.response.SkillCategoryResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.SkillCategoryService;

@RestController
@RequestMapping("/api/skill-categories")
public class SkillCategoryController {

    private final SkillCategoryService skillCategoryService;
    private final UserRepository userRepository;

    public SkillCategoryController(SkillCategoryService skillCategoryService, UserRepository userRepository) {
        this.skillCategoryService = skillCategoryService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<SkillCategoryResponse> getAll() {
        return skillCategoryService.getAll(getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillCategoryResponse create(@Valid @RequestBody SkillCategoryRequest request) {
        return skillCategoryService.create(getCurrentUserId(), request);
    }

    @PutMapping("/{id}")
    public SkillCategoryResponse update(@PathVariable UUID id, @Valid @RequestBody SkillCategoryRequest request) {
        return skillCategoryService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        skillCategoryService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(authentication.getName())
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}