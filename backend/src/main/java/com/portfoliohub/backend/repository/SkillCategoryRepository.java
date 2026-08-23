package com.portfoliohub.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.SkillCategory;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {

    Optional<SkillCategory> findByIdAndPortfolioId(UUID categoryId, UUID portfolioId);
}
