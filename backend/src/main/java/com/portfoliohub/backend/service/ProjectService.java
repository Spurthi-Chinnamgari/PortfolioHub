package com.portfoliohub.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.ProjectRequest;
import com.portfoliohub.backend.dto.response.ProjectResponse;
import com.portfoliohub.backend.entity.Project;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;
import com.portfoliohub.backend.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectPortfolioRepository projectPortfolioRepository) {
        this.projectRepository = projectRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    public ProjectResponse create(UUID userId, ProjectRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);

        Project project = new Project(
                portfolio,
                request.getTitle(),
                request.getSlug(),
                request.getShortDescription(),
                request.getFullDescription(),
                request.getThumbnailUrl(),
                request.getGithubUrl(),
                request.getLiveDemoUrl(),
                request.getFeatured(),
                request.getPublished(),
                request.getDisplayOrder()
        );
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());

        return toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);

        return projectRepository.findByPortfolioId(portfolio.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getById(UUID userId, UUID projectId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Project project = findProjectForPortfolio(projectId, portfolio.getId());

        return toResponse(project);
    }

    public ProjectResponse update(UUID userId, UUID projectId, ProjectRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Project project = findProjectForPortfolio(projectId, portfolio.getId());

        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setShortDescription(request.getShortDescription());
        project.setFullDescription(request.getFullDescription());
        project.setThumbnailUrl(request.getThumbnailUrl());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setFeatured(request.getFeatured() != null && request.getFeatured());
        project.setPublished(request.getPublished() == null || request.getPublished());
        project.setDisplayOrder(request.getDisplayOrder() == null ? 0 : request.getDisplayOrder());
        project.setUpdatedAt(Instant.now());

        return toResponse(projectRepository.save(project));
    }

    public void delete(UUID userId, UUID projectId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Project project = findProjectForPortfolio(projectId, portfolio.getId());

        projectRepository.delete(project);
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private Project findProjectForPortfolio(UUID projectId, UUID portfolioId) {
        return projectRepository.findByIdAndPortfolioId(projectId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setPortfolioId(project.getPortfolio().getId());
        response.setTitle(project.getTitle());
        response.setSlug(project.getSlug());
        response.setShortDescription(project.getShortDescription());
        response.setFullDescription(project.getFullDescription());
        response.setThumbnailUrl(project.getThumbnailUrl());
        response.setGithubUrl(project.getGithubUrl());
        response.setLiveDemoUrl(project.getLiveDemoUrl());
        response.setFeatured(project.isFeatured());
        response.setPublished(project.isPublished());
        response.setDisplayOrder(project.getDisplayOrder());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }
}
