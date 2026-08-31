package com.portfoliohub.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfoliohub.backend.dto.request.ExperienceRequest;
import com.portfoliohub.backend.dto.response.ExperienceResponse;
import com.portfoliohub.backend.entity.Experience;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.repository.ExperienceRepository;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public ExperienceService(ExperienceRepository experienceRepository,
                             ProjectPortfolioRepository projectPortfolioRepository) {
        this.experienceRepository = experienceRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    @Transactional
    public ExperienceResponse create(UUID userId, ExperienceRequest request) {
        validateRequest(request);
        
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        List<Experience> experiences = normalizeExperiences(portfolio.getId());

        Experience experience = new Experience(
                portfolio,
                request.getCompany(),
                request.getRole(),
                request.getEmploymentType(),
                request.getLocation(),
                request.getStartDate(),
                request.getCurrentlyWorking() != null && request.getCurrentlyWorking() ? null : request.getEndDate(),
                request.getCurrentlyWorking(),
                request.getDescription(),
                experiences.size() + 1
        );

        return toResponse(experienceRepository.save(experience));
    }

    @Transactional
    public List<ExperienceResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);

        return normalizeExperiences(portfolio.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ExperienceResponse getById(UUID userId, UUID experienceId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Experience experience = findExperienceForPortfolio(experienceId, portfolio.getId());

        return toResponse(experience);
    }

    @Transactional
    public ExperienceResponse update(UUID userId, UUID experienceId, ExperienceRequest request) {
        validateRequest(request);
        
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        normalizeExperiences(portfolio.getId());
        Experience experience = findExperienceForPortfolio(experienceId, portfolio.getId());

        experience.setCompany(request.getCompany());
        experience.setRole(request.getRole());
        experience.setEmploymentType(request.getEmploymentType());
        experience.setLocation(request.getLocation());
        experience.setStartDate(request.getStartDate());
        
        // If currently working, clear the end date
        if (request.getCurrentlyWorking() != null && request.getCurrentlyWorking()) {
            experience.setEndDate(null);
        } else {
            experience.setEndDate(request.getEndDate());
        }
        
        experience.setCurrentlyWorking(request.getCurrentlyWorking() != null && request.getCurrentlyWorking());
        experience.setDescription(request.getDescription());

        return toResponse(experienceRepository.save(experience));
    }

    @Transactional
    public void delete(UUID userId, UUID experienceId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Experience experience = findExperienceForPortfolio(experienceId, portfolio.getId());

        experienceRepository.delete(experience);
        normalizeExperiences(portfolio.getId());
    }

    private void validateRequest(ExperienceRequest request) {
        // Check if end date is before start date
        if (request.getEndDate() != null && request.getStartDate() != null) {
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new IllegalArgumentException("End date must be after or equal to start date");
            }
        }

        // If currently working is true, end date should be null
        if (request.getCurrentlyWorking() != null && request.getCurrentlyWorking() && request.getEndDate() != null) {
            // This is handled in the service by clearing endDate, but we can log a warning
            // In this case, we'll just let it be handled by clearing the endDate during save
        }
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private Experience findExperienceForPortfolio(UUID experienceId, UUID portfolioId) {
        return experienceRepository.findByIdAndPortfolioId(experienceId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Experience not found"));
    }

    private List<Experience> normalizeExperiences(UUID portfolioId) {
        List<Experience> experiences = experienceRepository.findByPortfolioId(portfolioId).stream()
                .sorted(Comparator.comparingInt((Experience exp) -> exp.getDisplayOrder() > 0 ? exp.getDisplayOrder() : Integer.MAX_VALUE)
                        .thenComparing(Experience::getCompany, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(experience -> experience.getId().toString()))
                .toList();

        for (int index = 0; index < experiences.size(); index++) {
            experiences.get(index).setDisplayOrder(index + 1);
        }

        if (!experiences.isEmpty()) {
            experienceRepository.saveAll(experiences);
        }
        return experiences;
    }

    private ExperienceResponse toResponse(Experience experience) {
        ExperienceResponse response = new ExperienceResponse();
        response.setId(experience.getId());
        response.setPortfolioId(experience.getPortfolio().getId());
        response.setCompany(experience.getCompany());
        response.setRole(experience.getRole());
        response.setEmploymentType(experience.getEmploymentType());
        response.setLocation(experience.getLocation());
        response.setStartDate(experience.getStartDate());
        response.setEndDate(experience.getEndDate());
        response.setCurrentlyWorking(experience.isCurrentlyWorking());
        response.setDescription(experience.getDescription());
        response.setDisplayOrder(experience.getDisplayOrder());
        return response;
    }
}
