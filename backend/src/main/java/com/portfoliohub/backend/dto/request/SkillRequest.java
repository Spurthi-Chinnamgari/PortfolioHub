package com.portfoliohub.backend.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name must not exceed 100 characters")
    private String name;

    private UUID categoryId;

    @Pattern(
            regexp = "^(|Beginner|Intermediate|Advanced|Expert)$",
            message = "Proficiency must be one of: Beginner, Intermediate, Advanced, Expert"
    )
    @Size(max = 30, message = "Proficiency must not exceed 30 characters")
    private String proficiency;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;

    public SkillRequest() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
