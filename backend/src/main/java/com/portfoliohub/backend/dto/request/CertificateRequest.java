package com.portfoliohub.backend.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CertificateRequest {

    @NotBlank(message = "Certificate title is required")
    @Size(max = 200, message = "Certificate title must not exceed 200 characters")
    private String title;

    @Size(max = 150, message = "Issuer must not exceed 150 characters")
    private String issuer;

    private String description;
    private LocalDate issueDate;

    @Pattern(regexp = "^$|https?://.+", message = "Credential URL must be a valid HTTP or HTTPS URL")
    private String credentialUrl;

    @Pattern(regexp = "^$|https?://.+", message = "File URL must be a valid HTTP or HTTPS URL")
    private String fileUrl;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;

    private Boolean published;

    public CertificateRequest() {
    }

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
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
}
