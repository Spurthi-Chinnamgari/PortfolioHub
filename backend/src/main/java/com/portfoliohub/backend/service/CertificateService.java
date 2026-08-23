package com.portfoliohub.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.CertificateRequest;
import com.portfoliohub.backend.dto.response.CertificateResponse;
import com.portfoliohub.backend.entity.Certificate;
import com.portfoliohub.backend.entity.ProjectPortfolio;
import com.portfoliohub.backend.repository.CertificateRepository;
import com.portfoliohub.backend.repository.ProjectPortfolioRepository;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final ProjectPortfolioRepository projectPortfolioRepository;

    public CertificateService(CertificateRepository certificateRepository,
                              ProjectPortfolioRepository projectPortfolioRepository) {
        this.certificateRepository = certificateRepository;
        this.projectPortfolioRepository = projectPortfolioRepository;
    }

    public List<CertificateResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        return certificateRepository.findByPortfolioIdOrderByDisplayOrderAscTitleAsc(portfolio.getId())
                .stream().map(this::toResponse).toList();
    }

    public CertificateResponse create(UUID userId, CertificateRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Certificate certificate = new Certificate(portfolio, request.getTitle(), request.getIssuer(),
                request.getDescription(), request.getIssueDate(), request.getCredentialUrl(),
                request.getFileUrl(), request.getDisplayOrder(), request.getPublished());
        return toResponse(certificateRepository.save(certificate));
    }

    public CertificateResponse update(UUID userId, UUID certificateId, CertificateRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Certificate certificate = certificateRepository.findByIdAndPortfolioId(certificateId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        certificate.setTitle(request.getTitle());
        certificate.setIssuer(request.getIssuer());
        certificate.setDescription(request.getDescription());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setCredentialUrl(request.getCredentialUrl());
        certificate.setFileUrl(request.getFileUrl());
        certificate.setDisplayOrder(request.getDisplayOrder() == null ? 0 : request.getDisplayOrder());
        certificate.setPublished(request.getPublished() == null || request.getPublished());
        return toResponse(certificateRepository.save(certificate));
    }

    public void delete(UUID userId, UUID certificateId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Certificate certificate = certificateRepository.findByIdAndPortfolioId(certificateId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        certificateRepository.delete(certificate);
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private CertificateResponse toResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();
        response.setId(certificate.getId());
        response.setPortfolioId(certificate.getPortfolio().getId());
        response.setTitle(certificate.getTitle());
        response.setIssuer(certificate.getIssuer());
        response.setDescription(certificate.getDescription());
        response.setIssueDate(certificate.getIssueDate());
        response.setCredentialUrl(certificate.getCredentialUrl());
        response.setFileUrl(certificate.getFileUrl());
        response.setDisplayOrder(certificate.getDisplayOrder());
        response.setPublished(certificate.isPublished());
        response.setCreatedAt(certificate.getCreatedAt());
        response.setUpdatedAt(certificate.getUpdatedAt());
        return response;
    }
}
