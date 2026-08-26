package com.portfoliohub.backend.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.SkillRequest;
import com.portfoliohub.backend.dto.response.SkillResponse;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.entity.Skill;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;
import com.portfoliohub.backend.repository.SkillCategoryRepository;
import com.portfoliohub.backend.repository.SkillRepository;

@Service
public class SkillService {

    private static final Set<String> ALLOWED_PROFICIENCIES = Set.of(
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert"
    );

    private final SkillRepository skillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public SkillService(SkillRepository skillRepository,
                        SkillCategoryRepository skillCategoryRepository,
                        ProjectPortfolioRepository projectPortfolioRepository) {
        this.skillRepository = skillRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    public List<SkillResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        return skillRepository.findByPortfolioIdOrderByDisplayOrderAscNameAsc(portfolio.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SkillResponse create(UUID userId, SkillRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        validateCategory(request.getCategoryId(), portfolio.getId());
        validateUniqueName(request.getName(), portfolio.getId(), null);
        validateProficiency(request.getProficiency());
        int displayOrder = request.getDisplayOrder() == null ? 0 : request.getDisplayOrder();
        validateUniqueDisplayOrder(portfolio.getId(), displayOrder, null);

        Skill skill = new Skill(
                portfolio,
                request.getCategoryId(),
                request.getName(),
                request.getProficiency(),
                displayOrder
        );
        return toResponse(skillRepository.save(skill));
    }

    public SkillResponse update(UUID userId, UUID skillId, SkillRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Skill skill = findSkillForPortfolio(skillId, portfolio.getId());
        validateCategory(request.getCategoryId(), portfolio.getId());
        validateUniqueName(request.getName(), portfolio.getId(), skill.getId());
        validateProficiency(request.getProficiency());
        int displayOrder = request.getDisplayOrder() == null ? 0 : request.getDisplayOrder();
        validateUniqueDisplayOrder(portfolio.getId(), displayOrder, skill.getId());

        skill.setCategoryId(request.getCategoryId());
        skill.setName(request.getName());
        skill.setProficiency(request.getProficiency());
        skill.setDisplayOrder(displayOrder);
        return toResponse(skillRepository.save(skill));
    }

    public void delete(UUID userId, UUID skillId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        skillRepository.delete(findSkillForPortfolio(skillId, portfolio.getId()));
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private Skill findSkillForPortfolio(UUID skillId, UUID portfolioId) {
        return skillRepository.findByIdAndPortfolioId(skillId, portfolioId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));
    }

    private void validateCategory(UUID categoryId, UUID portfolioId) {
        if (categoryId != null && skillCategoryRepository.findByIdAndPortfolioId(categoryId, portfolioId).isEmpty()) {
            throw new IllegalArgumentException("Skill category not found");
        }
    }

    private void validateProficiency(String proficiency) {
        if (proficiency == null || proficiency.isBlank()) {
            return;
        }

        String normalized = proficiency.trim();
        if (!ALLOWED_PROFICIENCIES.contains(normalized)) {
            throw new IllegalArgumentException("Proficiency must be one of: Beginner, Intermediate, Advanced, Expert");
        }
    }

    private void validateUniqueName(String name, UUID portfolioId, UUID currentSkillId) {
        if (skillRepository.existsByPortfolioIdAndName(portfolioId, name)
                && (currentSkillId == null || !skillRepository.findByIdAndPortfolioId(currentSkillId, portfolioId)
                .map(skill -> skill.getName().equals(name)).orElse(false))) {
            throw new IllegalArgumentException("Skill name already exists");
        }
    }

    private void validateUniqueDisplayOrder(UUID portfolioId, int displayOrder, UUID currentSkillId) {
        if (displayOrder <= 0) {
            return;
        }

        boolean conflict = currentSkillId == null
                ? skillRepository.existsByPortfolioIdAndDisplayOrder(portfolioId, displayOrder)
                : skillRepository.existsByPortfolioIdAndDisplayOrderAndIdNot(portfolioId, displayOrder, currentSkillId);

        if (conflict) {
            throw new IllegalArgumentException("Display order " + displayOrder + " is already in use. Please choose another order.");
        }
    }

    private SkillResponse toResponse(Skill skill) {
        SkillResponse response = new SkillResponse();
        response.setId(skill.getId());
        response.setPortfolioId(skill.getPortfolio().getId());
        response.setCategoryId(skill.getCategoryId());
        response.setName(skill.getName());
        response.setProficiency(skill.getProficiency());
        response.setDisplayOrder(skill.getDisplayOrder());
        return response;
    }
}
