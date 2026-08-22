package com.portfoliohub.backend.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.PortfolioRequest;
import com.portfoliohub.backend.dto.response.PortfolioResponse;
import com.portfoliohub.backend.entity.Portfolio;
import com.portfoliohub.backend.entity.User;
import com.portfoliohub.backend.repository.PortfolioRepository;
import com.portfoliohub.backend.repository.UserRepository;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    public PortfolioResponse create(UUID userId, PortfolioRequest request) {
        if (portfolioRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Portfolio already exists");
        }

        if (portfolioRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Slug already exists");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Portfolio portfolio = new Portfolio(
                user,
                request.getTitle(),
                request.getSlug(),
                request.getTheme(),
                request.getVisibility());
        portfolio.setCreatedAt(Instant.now());
        portfolio.setUpdatedAt(Instant.now());

        return toResponse(portfolioRepository.save(portfolio));
    }

    public PortfolioResponse getMyPortfolio(UUID userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        return toResponse(portfolio);
    }

    public PortfolioResponse update(UUID userId, PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        if (!portfolio.getSlug().equals(request.getSlug()) && portfolioRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Slug already exists");
        }

        portfolio.setTitle(request.getTitle());
        portfolio.setSlug(request.getSlug());
        portfolio.setTheme(request.getTheme());
        portfolio.setVisibility(request.getVisibility());
        portfolio.setUpdatedAt(Instant.now());

        return toResponse(portfolioRepository.save(portfolio));
    }

    public void delete(UUID userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        portfolioRepository.delete(portfolio);
    }

    private PortfolioResponse toResponse(Portfolio portfolio) {
        PortfolioResponse response = new PortfolioResponse();
        response.setId(portfolio.getId());
        response.setUserId(portfolio.getUser().getId());
        response.setTitle(portfolio.getTitle());
        response.setSlug(portfolio.getSlug());
        response.setTheme(portfolio.getTheme());
        response.setVisibility(portfolio.getVisibility());
        response.setCreatedAt(portfolio.getCreatedAt());
        response.setUpdatedAt(portfolio.getUpdatedAt());
        return response;
    }
}
