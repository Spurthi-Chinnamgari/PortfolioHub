package com.portfoliohub.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    List<Certificate> findByPortfolioIdOrderByDisplayOrderAscTitleAsc(UUID portfolioId);

    Optional<Certificate> findByIdAndPortfolioId(UUID certificateId, UUID portfolioId);
}
