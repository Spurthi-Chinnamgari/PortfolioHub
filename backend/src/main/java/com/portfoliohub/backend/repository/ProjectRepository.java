package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByPortfolioId(UUID portfolioId);

    List<Project> findByPortfolioIdOrderByDisplayOrderAscTitleAsc(UUID portfolioId);

    Optional<Project> findByIdAndPortfolioId(UUID projectId, UUID portfolioId);
}
