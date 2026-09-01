const API_BASE_URL = "http://localhost:8080";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Response did not contain JSON
        }

        throw new Error(errorMessage);
    }

    // DELETE may return 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function login(email, password) {
    return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function register(email, password) {
    return apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function getPublicPortfolio(slug) {
    return apiRequest(`/api/public/portfolio/${encodeURIComponent(slug)}`);
}

export async function getMyPortfolio() {
    return apiRequest("/api/portfolio/me");
}

export async function createPortfolio(portfolio) {
    return apiRequest("/api/portfolio/me", {
        method: "POST",
        body: JSON.stringify(portfolio),
    });
}

export async function updatePortfolio(portfolio) {
    return apiRequest("/api/portfolio/me", {
        method: "PUT",
        body: JSON.stringify(portfolio),
    });
}

export async function deletePortfolio() {
    return apiRequest("/api/portfolio/me", {
        method: "DELETE",
    });
}

export async function getProjects() {
    return apiRequest("/api/projects");
}

export async function createProject(project) {
    return apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(project),
    });
}

export async function updateProject(id, project) {
    return apiRequest(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(project),
    });
}

export async function deleteProject(id) {
    return apiRequest(`/api/projects/${id}`, {
        method: "DELETE",
    });
}

export async function getSkills() {
    return apiRequest("/api/skills");
}

export async function createSkill(skill) {
    return apiRequest("/api/skills", {
        method: "POST",
        body: JSON.stringify(skill),
    });
}

export async function updateSkill(id, skill) {
    return apiRequest(`/api/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify(skill),
    });
}

export async function deleteSkill(id) {
    return apiRequest(`/api/skills/${id}`, {
        method: "DELETE",
    });
}

export async function getSkillCategories() {
    return apiRequest("/api/skill-categories");
}

export async function createSkillCategory(category) {
    return apiRequest("/api/skill-categories", {
        method: "POST",
        body: JSON.stringify(category),
    });
}

export async function updateSkillCategory(id, category) {
    return apiRequest(`/api/skill-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
    });
}

export async function deleteSkillCategory(id) {
    return apiRequest(`/api/skill-categories/${id}`, {
        method: "DELETE",
    });
}

export async function getCertificates() {
    return apiRequest("/api/certificates");
}

export async function createCertificate(certificate) {
    return apiRequest("/api/certificates", {
        method: "POST",
        body: JSON.stringify(certificate),
    });
}

export async function updateCertificate(id, certificate) {
    return apiRequest(`/api/certificates/${id}`, {
        method: "PUT",
        body: JSON.stringify(certificate),
    });
}

export async function deleteCertificate(id) {
    return apiRequest(`/api/certificates/${id}`, {
        method: "DELETE",
    });
}

export async function getExperiences() {
    return apiRequest("/api/experiences");
}

export async function createExperience(experience) {
    return apiRequest("/api/experiences", {
        method: "POST",
        body: JSON.stringify(experience),
    });
}

export async function updateExperience(id, experience) {
    return apiRequest(`/api/experiences/${id}`, {
        method: "PUT",
        body: JSON.stringify(experience),
    });
}

export async function deleteExperience(id) {
    return apiRequest(`/api/experiences/${id}`, {
        method: "DELETE",
    });
}

export async function getSocialLinks() {
    return apiRequest("/api/social-links");
}

export async function createSocialLink(socialLink) {
    return apiRequest("/api/social-links", {
        method: "POST",
        body: JSON.stringify(socialLink),
    });
}

export async function updateSocialLink(id, socialLink) {
    return apiRequest(`/api/social-links/${id}`, {
        method: "PUT",
        body: JSON.stringify(socialLink),
    });
}

export async function deleteSocialLink(id) {
    return apiRequest(`/api/social-links/${id}`, {
        method: "DELETE",
    });
}

export async function sendContactMessage(portfolioSlug, message) {
    return apiRequest(`/api/contact/${encodeURIComponent(portfolioSlug)}`, {
        method: "POST",
        body: JSON.stringify(message),
    });
}

export async function getContactMessages() {
    return apiRequest("/api/contact/messages");
}

export async function markContactMessageAsRead(id, read = true) {
    return apiRequest(`/api/contact/messages/${id}/read`, {
        method: "PATCH",
        body: JSON.stringify({ read }),
    });
}

export async function deleteContactMessage(id) {
    return apiRequest(`/api/contact/messages/${id}`, {
        method: "DELETE",
    });
}
