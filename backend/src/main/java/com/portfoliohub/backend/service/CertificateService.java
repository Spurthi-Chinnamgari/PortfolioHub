package com.portfoliohub.backend.service;

import java.util.List;
import java.util.Comparator;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public List<CertificateResponse> getAll(UUID userId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        return normalizeCertificates(portfolio.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public CertificateResponse create(UUID userId, CertificateRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        List<Certificate> certificates = normalizeCertificates(portfolio.getId());
        Certificate certificate = new Certificate(portfolio, request.getTitle(), request.getIssuer(),
                request.getDescription(), request.getIssueDate(), request.getCredentialUrl(),
                request.getFileUrl(), certificates.size() + 1, request.getPublished());
        return toResponse(certificateRepository.save(certificate));
    }

    @Transactional
    public CertificateResponse update(UUID userId, UUID certificateId, CertificateRequest request) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        normalizeCertificates(portfolio.getId());
        Certificate certificate = certificateRepository.findByIdAndPortfolioId(certificateId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        certificate.setTitle(request.getTitle());
        certificate.setIssuer(request.getIssuer());
        certificate.setDescription(request.getDescription());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setCredentialUrl(request.getCredentialUrl());
        certificate.setFileUrl(request.getFileUrl());
        certificate.setPublished(request.getPublished() == null || request.getPublished());
        return toResponse(certificateRepository.save(certificate));
    }

    @Transactional
    public void delete(UUID userId, UUID certificateId) {
        ProjectPortfolio portfolio = getPortfolioForUser(userId);
        Certificate certificate = certificateRepository.findByIdAndPortfolioId(certificateId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        certificateRepository.delete(certificate);
        normalizeCertificates(portfolio.getId());
    }

    private ProjectPortfolio getPortfolioForUser(UUID userId) {
        return projectPortfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private List<Certificate> normalizeCertificates(UUID portfolioId) {
        List<Certificate> certificates = certificateRepository.findByPortfolioIdOrderByDisplayOrderAscTitleAsc(portfolioId).stream()
                .sorted(Comparator.comparingInt((Certificate certificate) -> certificate.getDisplayOrder() > 0 ? certificate.getDisplayOrder() : Integer.MAX_VALUE)
                        .thenComparing(Certificate::getTitle, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(certificate -> certificate.getId().toString()))
                .toList();

        for (int index = 0; index < certificates.size(); index++) {
            certificates.get(index).setDisplayOrder(index + 1);
        }
        if (!certificates.isEmpty()) {
            certificateRepository.saveAll(certificates);
        }
        return certificates;
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
