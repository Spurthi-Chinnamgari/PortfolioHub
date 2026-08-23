package com.portfoliohub.backend.entity;

import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private ProjectPortfolio portfolio;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "issuer", length = 150)
    private String issuer;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "credential_url", columnDefinition = "TEXT")
    private String credentialUrl;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "published", nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Certificate() {
    }

    public Certificate(ProjectPortfolio portfolio, String title, String issuer, String description,
                       LocalDate issueDate, String credentialUrl, String fileUrl,
                       Integer displayOrder, Boolean published) {
        this.portfolio = portfolio;
        this.title = title;
        this.issuer = issuer;
        this.description = description;
        this.issueDate = issueDate;
        this.credentialUrl = credentialUrl;
        this.fileUrl = fileUrl;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
        this.published = published == null || published;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public ProjectPortfolio getPortfolio() { return portfolio; }
    public String getTitle() { return title; }
    public String getIssuer() { return issuer; }
    public String getDescription() { return description; }
    public LocalDate getIssueDate() { return issueDate; }
    public String getCredentialUrl() { return credentialUrl; }
    public String getFileUrl() { return fileUrl; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setTitle(String title) { this.title = title; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public void setDescription(String description) { this.description = description; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    public void setPublished(boolean published) { this.published = published; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
