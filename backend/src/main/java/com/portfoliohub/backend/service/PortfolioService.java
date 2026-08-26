package com.portfoliohub.backend.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.PortfolioRequest;
import com.portfoliohub.backend.dto.response.PortfolioResponse;
import com.portfoliohub.backend.dto.response.PublicCertificateResponse;
import com.portfoliohub.backend.dto.response.PublicPortfolioResponse;
import com.portfoliohub.backend.dto.response.PublicProjectResponse;
import com.portfoliohub.backend.dto.response.PublicSkillResponse;
import com.portfoliohub.backend.entity.Certificate;
import com.portfoliohub.backend.entity.Portfolio;
import com.portfoliohub.backend.entity.Project;
import com.portfoliohub.backend.entity.Skill;
import com.portfoliohub.backend.entity.User;
import com.portfoliohub.backend.repository.CertificateRepository;
import com.portfoliohub.backend.repository.PortfolioRepository;
import com.portfoliohub.backend.repository.ProjectRepository;
import com.portfoliohub.backend.repository.SkillRepository;
import com.portfoliohub.backend.repository.UserRepository;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            UserRepository userRepository,
                            ProjectRepository projectRepository,
                            SkillRepository skillRepository,
                            CertificateRepository certificateRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.certificateRepository = certificateRepository;
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

    public PublicPortfolioResponse getPublicPortfolioBySlug(String slug) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        if (!"PUBLIC".equalsIgnoreCase(portfolio.getVisibility())) {
            throw new IllegalArgumentException("Portfolio not found");
        }

        PublicPortfolioResponse response = new PublicPortfolioResponse();
        response.setTitle(portfolio.getTitle());
        response.setSlug(portfolio.getSlug());
        response.setTheme(portfolio.getTheme());
        response.setVisibility(portfolio.getVisibility());
        response.setProjects(getPublicProjects(portfolio.getId()));
        response.setSkills(getPublicSkills(portfolio.getId()));
        response.setCertificates(getPublicCertificates(portfolio.getId()));
        return response;
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

    private List<PublicProjectResponse> getPublicProjects(UUID portfolioId) {
        return projectRepository.findByPortfolioId(portfolioId).stream()
                .filter(Project::isPublished)
                .sorted(Comparator.comparingInt(Project::getDisplayOrder)
                        .thenComparing(Project::getTitle, String.CASE_INSENSITIVE_ORDER))
                .map(this::toPublicProjectResponse)
                .toList();
    }

    private List<PublicSkillResponse> getPublicSkills(UUID portfolioId) {
        return skillRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt(Skill::getDisplayOrder)
                        .thenComparing(Skill::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toPublicSkillResponse)
                .toList();
    }

    private List<PublicCertificateResponse> getPublicCertificates(UUID portfolioId) {
        return certificateRepository.findByPortfolioIdOrderByDisplayOrderAscTitleAsc(portfolioId).stream()
                .filter(Certificate::isPublished)
                .sorted(Comparator.comparingInt(Certificate::getDisplayOrder)
                        .thenComparing(Certificate::getTitle, String.CASE_INSENSITIVE_ORDER))
                .map(this::toPublicCertificateResponse)
                .toList();
    }

    private PublicProjectResponse toPublicProjectResponse(Project project) {
        PublicProjectResponse response = new PublicProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setSlug(project.getSlug());
        response.setShortDescription(project.getShortDescription());
        response.setFullDescription(project.getFullDescription());
        response.setThumbnailUrl(project.getThumbnailUrl());
        response.setGithubUrl(project.getGithubUrl());
        response.setLiveDemoUrl(project.getLiveDemoUrl());
        response.setPublished(project.isPublished());
        return response;
    }

    private PublicSkillResponse toPublicSkillResponse(Skill skill) {
        PublicSkillResponse response = new PublicSkillResponse();
        response.setName(skill.getName());
        response.setProficiency(skill.getProficiency());
        response.setCategoryId(skill.getCategoryId());
        return response;
    }

    private PublicCertificateResponse toPublicCertificateResponse(Certificate certificate) {
        PublicCertificateResponse response = new PublicCertificateResponse();
        response.setTitle(certificate.getTitle());
        response.setIssuer(certificate.getIssuer());
        response.setDescription(certificate.getDescription());
        response.setIssueDate(certificate.getIssueDate());
        response.setCredentialUrl(certificate.getCredentialUrl());
        response.setFileUrl(certificate.getFileUrl());
        response.setPublished(certificate.isPublished());
        return response;
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
