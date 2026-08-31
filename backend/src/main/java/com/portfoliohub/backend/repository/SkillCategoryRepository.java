package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.SkillCategory;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {

    List<SkillCategory> findByPortfolioIdOrderByDisplayOrderAscNameAsc(UUID portfolioId);

    Optional<SkillCategory> findByIdAndPortfolioId(UUID categoryId, UUID portfolioId);

    boolean existsByPortfolioIdAndName(UUID portfolioId, String name);

    boolean existsByPortfolioIdAndNameAndIdNot(UUID portfolioId, String name, UUID categoryId);
}
