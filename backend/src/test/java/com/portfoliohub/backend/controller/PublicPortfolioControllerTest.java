package com.portfoliohub.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.portfoliohub.backend.dto.response.PublicCertificateResponse;
import com.portfoliohub.backend.dto.response.PublicPortfolioResponse;
import com.portfoliohub.backend.dto.response.PublicProjectResponse;
import com.portfoliohub.backend.dto.response.PublicSkillResponse;
import com.portfoliohub.backend.service.PortfolioService;

class PublicPortfolioControllerTest {

    @Test
    void getPublicPortfolio_shouldReturnPublicPortfolioData() {
        PortfolioService portfolioService = Mockito.mock(PortfolioService.class);
        PublicPortfolioController controller = new PublicPortfolioController(portfolioService);

        PublicProjectResponse project = new PublicProjectResponse();
        project.setId(UUID.randomUUID());
        project.setTitle("Portfolio Project");
        project.setSlug("portfolio-project");
        project.setShortDescription("Short description");
        project.setFullDescription("Long description");
        project.setThumbnailUrl("https://example.com/thumb.jpg");
        project.setGithubUrl("https://github.com/example");
        project.setLiveDemoUrl("https://example.com/demo");
        project.setPublished(true);

        PublicSkillResponse skill = new PublicSkillResponse();
        skill.setName("Java");
        skill.setProficiency("Advanced");

        PublicCertificateResponse certificate = new PublicCertificateResponse();
        certificate.setTitle("AWS Certified");
        certificate.setIssuer("AWS");
        certificate.setDescription("Cloud certification");

        PublicPortfolioResponse response = new PublicPortfolioResponse();
        response.setTitle("Spurthi");
        response.setSlug("spurthi");
        response.setTheme("MODERN_DEVELOPER");
        response.setVisibility("PUBLIC");
        response.setProjects(List.of(project));
        response.setSkills(List.of(skill));
        response.setCertificates(List.of(certificate));

        when(portfolioService.getPublicPortfolioBySlug("spurthi")).thenReturn(response);

        PublicPortfolioResponse result = controller.getPublicPortfolio("spurthi");

        assertNotNull(result);
        assertEquals("Spurthi", result.getTitle());
        assertEquals("spurthi", result.getSlug());
        assertEquals("Portfolio Project", result.getProjects().getFirst().getTitle());
        assertEquals("Java", result.getSkills().getFirst().getName());
        assertEquals("AWS", result.getCertificates().getFirst().getIssuer());

        verify(portfolioService).getPublicPortfolioBySlug("spurthi");
    }
}
