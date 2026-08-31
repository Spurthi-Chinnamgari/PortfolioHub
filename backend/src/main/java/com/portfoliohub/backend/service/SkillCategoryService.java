package com.portfoliohub.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfoliohub.backend.dto.request.SkillCategoryRequest;
import com.portfoliohub.backend.dto.response.SkillCategoryResponse;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.entity.SkillCategory;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;
import com.portfoliohub.backend.repository.SkillCategoryRepository;

@Service
public class SkillCategoryService {

    private final SkillCategoryRepository skillCategoryRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public SkillCategoryService(SkillCategoryRepository skillCategoryRepository,
                                ProjectPortfolioRepository projectPortfolioRepository) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    @Transactional
    public List<SkillCategoryResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        return normalize(portfolio.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SkillCategoryResponse create(UUID userId, SkillCategoryRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        List<SkillCategory> categories = normalize(portfolio.getId());
        String name = request.getName().trim();
        if (skillCategoryRepository.existsByPortfolioIdAndName(portfolio.getId(), name)) {
            throw new IllegalArgumentException("Skill category name already exists");
        }
        return toResponse(skillCategoryRepository.save(new SkillCategory(portfolio, name, categories.size() + 1)));
    }

    @Transactional
    public SkillCategoryResponse update(UUID userId, UUID categoryId, SkillCategoryRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        SkillCategory category = findForPortfolio(categoryId, portfolio.getId());
        String name = request.getName().trim();
        if (skillCategoryRepository.existsByPortfolioIdAndNameAndIdNot(portfolio.getId(), name, categoryId)) {
            throw new IllegalArgumentException("Skill category name already exists");
        }
        category.setName(name);
        return toResponse(skillCategoryRepository.save(category));
    }

    @Transactional
    public void delete(UUID userId, UUID categoryId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        skillCategoryRepository.delete(findForPortfolio(categoryId, portfolio.getId()));
        normalize(portfolio.getId());
    }

    private List<SkillCategory> normalize(UUID portfolioId) {
        List<SkillCategory> categories = skillCategoryRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt((SkillCategory category) -> category.getDisplayOrder() > 0 ? category.getDisplayOrder() : Integer.MAX_VALUE)
                        .thenComparing(SkillCategory::getName, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(category -> category.getId().toString()))
                .toList();
        for (int index = 0; index < categories.size(); index++) {
            categories.get(index).setDisplayOrder(index + 1);
        }
        if (!categories.isEmpty()) {
            skillCategoryRepository.saveAll(categories);
        }
        return categories;
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private SkillCategory findForPortfolio(UUID categoryId, UUID portfolioId) {
        return skillCategoryRepository.findByIdAndPortfolioId(categoryId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Skill category not found"));
    }

    private SkillCategoryResponse toResponse(SkillCategory category) {
        SkillCategoryResponse response = new SkillCategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDisplayOrder(category.getDisplayOrder());
        return response;
    }
}