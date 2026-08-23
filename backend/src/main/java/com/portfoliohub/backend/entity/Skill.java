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

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private ProjectPortfolio portfolio;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "proficiency", length = 30)
    private String proficiency;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected Skill() {
    }

    public Skill(ProjectPortfolio portfolio, UUID categoryId, String name, String proficiency, Integer displayOrder) {
        this.portfolio = portfolio;
        this.categoryId = categoryId;
        this.name = name;
        this.proficiency = proficiency;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
    }

    public UUID getId() { return id; }
    public ProjectPortfolio getPortfolio() { return portfolio; }
    public UUID getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getProficiency() { return proficiency; }
    public int getDisplayOrder() { return displayOrder; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public void setName(String name) { this.name = name; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
