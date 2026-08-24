package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    List<ContactMessage> findByPortfolioIdOrderByCreatedAtDesc(UUID portfolioId);

    Optional<ContactMessage> findByIdAndPortfolioId(UUID messageId, UUID portfolioId);
}
