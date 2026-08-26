package com.portfoliohub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfoliohub.backend.dto.response.PublicPortfolioResponse;
import com.portfoliohub.backend.service.PortfolioService;

@RestController
@RequestMapping("/api/public")
public class PublicPortfolioController {

    private final PortfolioService portfolioService;

    public PublicPortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio/{slug}")
    public PublicPortfolioResponse getPublicPortfolio(@PathVariable String slug) {
        return portfolioService.getPublicPortfolioBySlug(slug);
    }
}
