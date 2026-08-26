package com.portfoliohub.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

public class PublicPortfolioResponse {

    private String title;
    private String slug;
    private String theme;
    private String visibility;
    private List<PublicProjectResponse> projects = new ArrayList<>();
    private List<PublicSkillResponse> skills = new ArrayList<>();
    private List<PublicCertificateResponse> certificates = new ArrayList<>();

    public PublicPortfolioResponse() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public List<PublicProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<PublicProjectResponse> projects) {
        this.projects = projects == null ? new ArrayList<>() : projects;
    }

    public List<PublicSkillResponse> getSkills() {
        return skills;
    }

    public void setSkills(List<PublicSkillResponse> skills) {
        this.skills = skills == null ? new ArrayList<>() : skills;
    }

    public List<PublicCertificateResponse> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<PublicCertificateResponse> certificates) {
        this.certificates = certificates == null ? new ArrayList<>() : certificates;
    }
}
