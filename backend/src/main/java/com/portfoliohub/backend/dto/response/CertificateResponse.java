package com.portfoliohub.backend.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class CertificateResponse {

    private UUID id;
    private UUID portfolioId;
    private String title;
    private String issuer;
    private String description;
    private LocalDate issueDate;
    private String credentialUrl;
    private String fileUrl;
    private int displayOrder;
    private boolean published;
    private Instant createdAt;
    private Instant updatedAt;

    public CertificateResponse() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getPortfolioId() { return portfolioId; }
    public void setPortfolioId(UUID portfolioId) { this.portfolioId = portfolioId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public String getCredentialUrl() { return credentialUrl; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
