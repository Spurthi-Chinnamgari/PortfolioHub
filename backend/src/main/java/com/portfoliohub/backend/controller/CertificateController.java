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

import com.portfoliohub.backend.dto.request.CertificateRequest;
import com.portfoliohub.backend.dto.response.CertificateResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.CertificateService;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final UserRepository userRepository;

    public CertificateController(CertificateService certificateService, UserRepository userRepository) {
        this.certificateService = certificateService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<CertificateResponse> getAll() {
        return certificateService.getAll(getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CertificateResponse create(@Valid @RequestBody CertificateRequest request) {
        return certificateService.create(getCurrentUserId(), request);
    }

    @PutMapping("/{id}")
    public CertificateResponse update(@PathVariable UUID id, @Valid @RequestBody CertificateRequest request) {
        return certificateService.update(getCurrentUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        certificateService.delete(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(authentication.getName())
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
