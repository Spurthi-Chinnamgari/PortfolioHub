package com.portfoliohub.backend.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.PortfolioRequest;
import com.portfoliohub.backend.dto.response.PortfolioResponse;
import com.portfoliohub.backend.dto.response.PublicCertificateResponse;
import com.portfoliohub.backend.dto.response.PublicExperienceResponse;
import com.portfoliohub.backend.dto.response.PublicPortfolioResponse;
import com.portfoliohub.backend.dto.response.PublicProjectResponse;
import com.portfoliohub.backend.dto.response.PublicSkillResponse;
import com.portfoliohub.backend.dto.response.PublicSocialLinkResponse;
import com.portfoliohub.backend.entity.Certificate;
import com.portfoliohub.backend.entity.Experience;
import com.portfoliohub.backend.entity.Portfolio;
import com.portfoliohub.backend.entity.Project;
import com.portfoliohub.backend.entity.Skill;
import com.portfoliohub.backend.entity.SkillCategory;
import com.portfoliohub.backend.entity.SocialLink;
import com.portfoliohub.backend.entity.User;
import com.portfoliohub.backend.repository.CertificateRepository;
import com.portfoliohub.backend.repository.ExperienceRepository;
import com.portfoliohub.backend.repository.PortfolioRepository;
import com.portfoliohub.backend.repository.ProjectRepository;
import com.portfoliohub.backend.repository.SkillRepository;
import com.portfoliohub.backend.repository.SkillCategoryRepository;
import com.portfoliohub.backend.repository.SocialLinkRepository;
import com.portfoliohub.backend.repository.UserRepository;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final CertificateRepository certificateRepository;
    private final ExperienceRepository experienceRepository;
    private final SocialLinkRepository socialLinkRepository;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            UserRepository userRepository,
                            ProjectRepository projectRepository,
                            SkillRepository skillRepository,
                            SkillCategoryRepository skillCategoryRepository,
                            CertificateRepository certificateRepository,
                            ExperienceRepository experienceRepository,
                            SocialLinkRepository socialLinkRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.certificateRepository = certificateRepository;
        this.experienceRepository = experienceRepository;
        this.socialLinkRepository = socialLinkRepository;
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

    @Transactional
    public PublicPortfolioResponse getPublicPortfolioBySlug(String slug) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        if (!"PUBLIC".equalsIgnoreCase(portfolio.getVisibility())) {
            throw new IllegalArgumentException("Portfolio not found");
        }

        normalizeDisplayOrders(portfolio.getId());

        PublicPortfolioResponse response = new PublicPortfolioResponse();
        response.setTitle(portfolio.getTitle());
        response.setSlug(portfolio.getSlug());
        response.setTheme(portfolio.getTheme());
        response.setVisibility(portfolio.getVisibility());
        response.setProjects(getPublicProjects(portfolio.getId()));
        response.setSkills(getPublicSkills(portfolio.getId()));
        response.setCertificates(getPublicCertificates(portfolio.getId()));
        response.setExperiences(getPublicExperiences(portfolio.getId()));
        response.setSocialLinks(getPublicSocialLinks(portfolio.getId()));
        
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
        List<SkillCategory> categories = skillCategoryRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolioId);
        return skillRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt(Skill::getDisplayOrder)
                        .thenComparing(Skill::getName, String.CASE_INSENSITIVE_ORDER))
                .map(skill -> toPublicSkillResponse(skill, categories))
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

    private List<PublicExperienceResponse> getPublicExperiences(UUID portfolioId) {
        return experienceRepository.findByPortfolioIdOrderByDisplayOrderAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt(Experience::getDisplayOrder)
                        .thenComparing(Experience::getCompany, String.CASE_INSENSITIVE_ORDER))
                .map(this::toPublicExperienceResponse)
                .toList();
    }

    private void normalizeDisplayOrders(UUID portfolioId) {
            List<Project> projects = projectRepository.findByPortfolioId(portfolioId).stream()
                .sorted(Comparator.comparingInt((Project project) -> project.getDisplayOrder() > 0 ? project.getDisplayOrder() : Integer.MAX_VALUE)
                    .thenComparing(Project::getTitle, String.CASE_INSENSITIVE_ORDER)
                    .thenComparing(project -> project.getId().toString()))
                .toList();
            for (int index = 0; index < projects.size(); index++) {
                projects.get(index).setDisplayOrder(index + 1);
    }
            projectRepository.saveAll(projects);

            List<Skill> skills = skillRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt((Skill skill) -> skill.getDisplayOrder() > 0 ? skill.getDisplayOrder() : Integer.MAX_VALUE)
                    .thenComparing(Skill::getName, String.CASE_INSENSITIVE_ORDER)
                    .thenComparing(skill -> skill.getId().toString()))
                .toList();
            for (int index = 0; index < skills.size(); index++) {
                skills.get(index).setDisplayOrder(index + 1);
            }
            skillRepository.saveAll(skills);

            List<Certificate> certificates = certificateRepository.findByPortfolioIdOrderByDisplayOrderAscTitleAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt((Certificate certificate) -> certificate.getDisplayOrder() > 0 ? certificate.getDisplayOrder() : Integer.MAX_VALUE)
                    .thenComparing(Certificate::getTitle, String.CASE_INSENSITIVE_ORDER)
                    .thenComparing(certificate -> certificate.getId().toString()))
                .toList();
            for (int index = 0; index < certificates.size(); index++) {
                certificates.get(index).setDisplayOrder(index + 1);
            }
            certificateRepository.saveAll(certificates);
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

    private PublicSkillResponse toPublicSkillResponse(Skill skill, List<SkillCategory> categories) {
        PublicSkillResponse response = new PublicSkillResponse();
        response.setName(skill.getName());
        response.setProficiency(skill.getProficiency());
        response.setCategoryId(skill.getCategoryId());
        response.setCategoryName(categories.stream()
            .filter(category -> category.getId().equals(skill.getCategoryId()))
            .map(SkillCategory::getName)
            .findFirst()
            .orElse(null));
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

    private PublicExperienceResponse toPublicExperienceResponse(Experience experience) {
        PublicExperienceResponse response = new PublicExperienceResponse();
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

    private List<PublicSocialLinkResponse> getPublicSocialLinks(UUID portfolioId) {
        return socialLinkRepository.findByPortfolioId(portfolioId).stream()
                .sorted(Comparator.comparingInt(SocialLink::getDisplayOrder)
                        .thenComparing(SocialLink::getPlatform, String.CASE_INSENSITIVE_ORDER))
                .map(this::toPublicSocialLinkResponse)
                .toList();
    }

    private PublicSocialLinkResponse toPublicSocialLinkResponse(SocialLink socialLink) {
        PublicSocialLinkResponse response = new PublicSocialLinkResponse();
        response.setPlatform(socialLink.getPlatform());
        response.setUrl(socialLink.getUrl());
        response.setDisplayOrder(socialLink.getDisplayOrder());
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
