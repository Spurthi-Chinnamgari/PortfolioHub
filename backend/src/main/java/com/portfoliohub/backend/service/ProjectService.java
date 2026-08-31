package com.portfoliohub.backend.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public ProjectResponse create(UUID userId, ProjectRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        List<Project> projects = normalizeProjects(portfolio.getId());

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
                projects.size() + 1
        );
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public List<ProjectResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);

        return normalizeProjects(portfolio.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getById(UUID userId, UUID projectId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Project project = findProjectForPortfolio(projectId, portfolio.getId());

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse update(UUID userId, UUID projectId, ProjectRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        normalizeProjects(portfolio.getId());
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
        project.setUpdatedAt(Instant.now());

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(UUID userId, UUID projectId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Project project = findProjectForPortfolio(projectId, portfolio.getId());

        projectRepository.delete(project);
        normalizeProjects(portfolio.getId());
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private Project findProjectForPortfolio(UUID projectId, UUID portfolioId) {
        return projectRepository.findByIdAndPortfolioId(projectId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private List<Project> normalizeProjects(UUID portfolioId) {
        List<Project> projects = projectRepository.findByPortfolioId(portfolioId).stream()
                .sorted(Comparator.comparingInt((Project project) -> project.getDisplayOrder() > 0 ? project.getDisplayOrder() : Integer.MAX_VALUE)
                        .thenComparing(Project::getTitle, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(project -> project.getId().toString()))
                .toList();

        for (int index = 0; index < projects.size(); index++) {
            projects.get(index).setDisplayOrder(index + 1);
        }

        if (!projects.isEmpty()) {
            projectRepository.saveAll(projects);
        }
        return projects;
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
