package com.portfoliohub.backend.entity;

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
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private ProjectPortfolio portfolio;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "slug", length = 150)
    private String slug;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "github_url", columnDefinition = "TEXT")
    private String githubUrl;

    @Column(name = "live_demo_url", columnDefinition = "TEXT")
    private String liveDemoUrl;

    @Column(name = "featured")
    private boolean featured;

    @Column(name = "published")
    private boolean published;

    @Column(name = "display_order")
    private int displayOrder;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected Project() {
    }

    public Project(ProjectPortfolio portfolio, String title, String slug, String shortDescription,
                   String fullDescription, String thumbnailUrl, String githubUrl, String liveDemoUrl,
                   Boolean featured, Boolean published, Integer displayOrder) {
        this.portfolio = portfolio;
        this.title = title;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.thumbnailUrl = thumbnailUrl;
        this.githubUrl = githubUrl;
        this.liveDemoUrl = liveDemoUrl;
        this.featured = featured != null && featured;
        this.published = published == null || published;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ProjectPortfolio getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(ProjectPortfolio portfolio) {
        this.portfolio = portfolio;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLiveDemoUrl() {
        return liveDemoUrl;
    }

    public void setLiveDemoUrl(String liveDemoUrl) {
        this.liveDemoUrl = liveDemoUrl;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
