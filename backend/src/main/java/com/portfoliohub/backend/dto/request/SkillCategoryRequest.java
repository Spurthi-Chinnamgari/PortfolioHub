package com.portfoliohub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkillCategoryRequest {

    @NotBlank(message = "Skill category name is required")
    @Size(max = 100, message = "Skill category name must not exceed 100 characters")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}