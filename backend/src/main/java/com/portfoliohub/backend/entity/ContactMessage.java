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
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "subject", length = 250)
    private String subject;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "read", nullable = false)
    private boolean read;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ContactMessage() {
    }

    public ContactMessage(Portfolio portfolio, String name, String email, String subject, String message) {
        this.portfolio = portfolio;
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.status = "UNREAD";
        this.read = false;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Portfolio getPortfolio() { return portfolio; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) {
        this.read = read;
        this.status = read ? "READ" : "UNREAD";
    }
    public Instant getCreatedAt() { return createdAt; }
}
