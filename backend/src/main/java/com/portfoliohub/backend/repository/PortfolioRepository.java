package com.portfoliohub.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {

    Optional<Portfolio> findByUserId(UUID userId);

    Optional<Portfolio> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
