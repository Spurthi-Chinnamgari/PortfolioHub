package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findByPortfolioIdOrderByDisplayOrderAscNameAsc(UUID portfolioId);

    Optional<Skill> findByIdAndPortfolioId(UUID skillId, UUID portfolioId);

    boolean existsByPortfolioIdAndName(UUID portfolioId, String name);

}
