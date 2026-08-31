package com.portfoliohub.backend.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "social_links", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"portfolio_id", "platform"}, name = "uq_social_platform_per_portfolio")
})
public class SocialLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private ProjectPortfolio portfolio;

    @Column(name = "platform", nullable = false, length = 50)
    private String platform;

    @Column(name = "url", nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected SocialLink() {
    }

    public SocialLink(ProjectPortfolio portfolio, String platform, String url, Integer displayOrder) {
        this.portfolio = portfolio;
        this.platform = platform;
        this.url = url;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
    }

    // Getters and Setters
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

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
