package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.Experience;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    List<Experience> findByPortfolioId(UUID portfolioId);

    List<Experience> findByPortfolioIdOrderByDisplayOrderAsc(UUID portfolioId);

    Optional<Experience> findByIdAndPortfolioId(UUID experienceId, UUID portfolioId);
}
