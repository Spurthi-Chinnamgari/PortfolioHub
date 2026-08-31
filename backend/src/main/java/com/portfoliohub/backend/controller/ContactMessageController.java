package com.portfoliohub.backend.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.portfoliohub.backend.dto.request.ContactMessageRequest;
import com.portfoliohub.backend.dto.request.ContactMessageReadRequest;
import com.portfoliohub.backend.dto.response.ContactMessageResponse;
import com.portfoliohub.backend.repository.UserRepository;
import com.portfoliohub.backend.service.ContactMessageService;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;
    private final UserRepository userRepository;

    public ContactMessageController(ContactMessageService contactMessageService, UserRepository userRepository) {
        this.contactMessageService = contactMessageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{portfolioSlug}")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessageResponse create(@PathVariable String portfolioSlug,
                                          @Valid @RequestBody ContactMessageRequest request) {
        return contactMessageService.create(portfolioSlug, request);
    }

    @GetMapping("/messages")
    public List<ContactMessageResponse> getMessages() {
        return contactMessageService.getForOwner(getCurrentUserId());
    }

    @PatchMapping("/messages/{id}/read")
    public ContactMessageResponse updateMessageReadStatus(@PathVariable UUID id,
                                                           @RequestBody ContactMessageReadRequest request) {
        return contactMessageService.updateReadStatusForOwner(getCurrentUserId(), id, request.isRead());
    }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMessage(@PathVariable UUID id) {
        contactMessageService.deleteForOwner(getCurrentUserId(), id);
    }

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(authentication.getName())
                .map(user -> user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
