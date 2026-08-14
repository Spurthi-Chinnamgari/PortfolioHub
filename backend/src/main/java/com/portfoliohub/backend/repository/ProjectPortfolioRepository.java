package com.portfoliohub.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.ProjectPortfolio;

public interface ProjectPortfolioRepository extends JpaRepository<ProjectPortfolio, UUID> {

    Optional<ProjectPortfolio> findByUserId(UUID userId);
}
