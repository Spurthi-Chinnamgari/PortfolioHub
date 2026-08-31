package com.portfoliohub.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.portfoliohub.backend.dto.request.ContactMessageRequest;
import com.portfoliohub.backend.dto.response.ContactMessageResponse;
import com.portfoliohub.backend.entity.ContactMessage;
import com.portfoliohub.backend.entity.Portfolio;
import com.portfoliohub.backend.repository.ContactMessageRepository;
import com.portfoliohub.backend.repository.PortfolioRepository;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final PortfolioRepository portfolioRepository;

    public ContactMessageService(ContactMessageRepository contactMessageRepository,
                                 PortfolioRepository portfolioRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.portfolioRepository = portfolioRepository;
    }

    public ContactMessageResponse create(String portfolioSlug, ContactMessageRequest request) {
        Portfolio portfolio = portfolioRepository.findBySlug(portfolioSlug)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        ContactMessage message = new ContactMessage(
                portfolio, request.getName(), request.getEmail(), request.getSubject(), request.getMessage());
        return toResponse(contactMessageRepository.save(message));
    }

    public List<ContactMessageResponse> getForOwner(UUID userId) {
        Portfolio portfolio = getPortfolioForUser(userId);
        return contactMessageRepository.findByPortfolioIdOrderByCreatedAtDesc(portfolio.getId())
                .stream().map(this::toResponse).toList();
    }

    public ContactMessageResponse updateReadStatusForOwner(UUID userId, UUID messageId, boolean read) {
        Portfolio portfolio = getPortfolioForUser(userId);
        ContactMessage message = contactMessageRepository.findByIdAndPortfolioId(messageId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Contact message not found"));

        if (message.isRead() != read) {
            message.setRead(read);
            message = contactMessageRepository.save(message);
        }

        return toResponse(message);
    }

    public void deleteForOwner(UUID userId, UUID messageId) {
        Portfolio portfolio = getPortfolioForUser(userId);
        ContactMessage message = contactMessageRepository.findByIdAndPortfolioId(messageId, portfolio.getId())
                .orElseThrow(() -> new IllegalArgumentException("Contact message not found"));
        contactMessageRepository.delete(message);
    }

    private Portfolio getPortfolioForUser(UUID userId) {
        return portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
    }

    private ContactMessageResponse toResponse(ContactMessage message) {
        ContactMessageResponse response = new ContactMessageResponse();
        response.setId(message.getId());
        response.setPortfolioId(message.getPortfolio().getId());
        response.setName(message.getName());
        response.setEmail(message.getEmail());
        response.setSubject(message.getSubject());
        response.setMessage(message.getMessage());
        response.setStatus(message.getStatus());
        response.setRead(message.isRead());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}
