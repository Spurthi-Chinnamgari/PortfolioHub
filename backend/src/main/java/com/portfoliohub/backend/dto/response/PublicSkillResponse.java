package com.portfoliohub.backend.dto.response;

import java.util.UUID;

public class PublicSkillResponse {

    private String name;
    private String proficiency;
    private UUID categoryId;

    public PublicSkillResponse() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }
}
