package com.portfoliohub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PortfolioRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Bio is required")
    private String bio;

    @NotBlank(message = "Skills are required")
    private String skills;

    public PortfolioRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
}
