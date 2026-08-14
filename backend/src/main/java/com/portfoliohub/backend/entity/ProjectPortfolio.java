package com.portfoliohub.backend.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "portfolios")
public class ProjectPortfolio {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected ProjectPortfolio() {
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
}
