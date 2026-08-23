package com.portfoliohub.backend.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill_categories")
public class SkillCategory {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private ProjectPortfolio portfolio;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected SkillCategory() {
    }

    public UUID getId() {
        return id;
    }

    public ProjectPortfolio getPortfolio() {
        return portfolio;
    }

    public String getName() {
        return name;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
