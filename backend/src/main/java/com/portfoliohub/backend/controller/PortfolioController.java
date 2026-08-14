package com.portfoliohub.backend.controller;

import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.portfoliohub.backend.dto.request.PortfolioRequest;
import com.portfoliohub.backend.dto.response.PortfolioResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.PortfolioService;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserRepository userRepository;

    public PortfolioController(PortfolioService portfolioService, UserRepository userRepository) {
        this.portfolioService = portfolioService;
        this.userRepository = userRepository;
    }

    @PostMapping("/me")
    @ResponseStatus(HttpStatus.CREATED)
    public PortfolioResponse create(@Valid @RequestBody PortfolioRequest request) {
        return portfolioService.create(getCurrentUserId(), request);
    }

    @GetMapping("/me")
    public PortfolioResponse getMyPortfolio() {
        return portfolioService.getMyPortfolio(getCurrentUserId());
    }

    @PutMapping("/me")
    public PortfolioResponse update(@Valid @RequestBody PortfolioRequest request) {
        return portfolioService.update(getCurrentUserId(), request);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete() {
        portfolioService.delete(getCurrentUserId());
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
