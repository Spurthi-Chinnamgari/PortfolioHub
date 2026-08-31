package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.SocialLink;

public interface SocialLinkRepository extends JpaRepository<SocialLink, UUID> {

    List<SocialLink> findByPortfolioId(UUID portfolioId);

    List<SocialLink> findByPortfolioIdOrderByDisplayOrderAsc(UUID portfolioId);

    Optional<SocialLink> findByIdAndPortfolioId(UUID socialLinkId, UUID portfolioId);

    Optional<SocialLink> findByPortfolioIdAndPlatform(UUID portfolioId, String platform);
}
