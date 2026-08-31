package com.portfoliohub.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfoliohub.backend.dto.request.SocialLinkRequest;
import com.portfoliohub.backend.dto.response.SocialLinkResponse;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.entity.SocialLink;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;
import com.portfoliohub.backend.repository.SocialLinkRepository;

@Service
public class SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public SocialLinkService(SocialLinkRepository socialLinkRepository,
                             ProjectPortfolioRepository projectPortfolioRepository) {
        this.socialLinkRepository = socialLinkRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    @Transactional
    public SocialLinkResponse create(UUID userId, SocialLinkRequest request) {
        validateRequest(request);
        
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        
        // Check for duplicate platform
        if (socialLinkRepository.findByPortfolioIdAndPlatform(portfolio.getId(), request.getPlatform()).isPresent()) {
            throw new IllegalArgumentException("A social link for this platform already exists");
        }
        
        List<SocialLink> socialLinks = normalizeSocialLinks(portfolio.getId());

        SocialLink socialLink = new SocialLink(
                portfolio,
                request.getPlatform(),
                request.getUrl(),
                socialLinks.size() + 1
        );

        return toResponse(socialLinkRepository.save(socialLink));
    }

    @Transactional
    public List<SocialLinkResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);

        return normalizeSocialLinks(portfolio.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public SocialLinkResponse getById(UUID userId, UUID socialLinkId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        SocialLink socialLink = findSocialLinkForPortfolio(socialLinkId, portfolio.getId());

        return toResponse(socialLink);
    }

    @Transactional
    public SocialLinkResponse update(UUID userId, UUID socialLinkId, SocialLinkRequest request) {
        validateRequest(request);
        
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        SocialLink socialLink = findSocialLinkForPortfolio(socialLinkId, portfolio.getId());

        // If platform is being changed, check for duplicate
        if (!socialLink.getPlatform().equals(request.getPlatform())) {
            if (socialLinkRepository.findByPortfolioIdAndPlatform(portfolio.getId(), request.getPlatform()).isPresent()) {
                throw new IllegalArgumentException("A social link for this platform already exists");
            }
        }

        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());

        return toResponse(socialLinkRepository.save(socialLink));
    }

    @Transactional
    public void delete(UUID userId, UUID socialLinkId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        SocialLink socialLink = findSocialLinkForPortfolio(socialLinkId, portfolio.getId());

        socialLinkRepository.delete(socialLink);
        normalizeSocialLinks(portfolio.getId());
    }

    private void validateRequest(SocialLinkRequest request) {
        // URL validation is done via @Pattern in the request DTO
        // Additional validation can be added here if needed
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private SocialLink findSocialLinkForPortfolio(UUID socialLinkId, UUID portfolioId) {
        return socialLinkRepository.findByIdAndPortfolioId(socialLinkId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Social link not found"));
    }

    private List<SocialLink> normalizeSocialLinks(UUID portfolioId) {
        List<SocialLink> socialLinks = socialLinkRepository.findByPortfolioId(portfolioId).stream()
                .sorted(Comparator.comparingInt((SocialLink link) -> link.getDisplayOrder() > 0 ? link.getDisplayOrder() : Integer.MAX_VALUE)
                        .thenComparing(SocialLink::getPlatform, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(link -> link.getId().toString()))
                .toList();

        for (int index = 0; index < socialLinks.size(); index++) {
            socialLinks.get(index).setDisplayOrder(index + 1);
        }

        if (!socialLinks.isEmpty()) {
            socialLinkRepository.saveAll(socialLinks);
        }
        return socialLinks;
    }

    private SocialLinkResponse toResponse(SocialLink socialLink) {
        SocialLinkResponse response = new SocialLinkResponse();
        response.setId(socialLink.getId());
        response.setPortfolioId(socialLink.getPortfolio().getId());
        response.setPlatform(socialLink.getPlatform());
        response.setUrl(socialLink.getUrl());
        response.setDisplayOrder(socialLink.getDisplayOrder());
        return response;
    }
}
