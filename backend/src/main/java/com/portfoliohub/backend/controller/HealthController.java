package com.portfoliohub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PostConstruct;

@RestController
public class HealthController {

    @PostConstruct
    public void init() {
        System.out.println("🔥🔥🔥 HEALTH CONTROLLER LOADED 🔥🔥🔥");
    }

    @GetMapping("/healthz")
    public String health() {
        return "OK";
    }
}