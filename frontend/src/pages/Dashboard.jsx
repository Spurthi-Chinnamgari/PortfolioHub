import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    createPortfolio,
    createProject,
    createSkill,
    createSkillCategory,
    createCertificate,
    createExperience,
    createSocialLink,
    deletePortfolio,
    deleteProject,
    deleteSkill,
    deleteSkillCategory,
    deleteCertificate,
    deleteExperience,
    deleteSocialLink,
    deleteContactMessage,
    getMyPortfolio,
    getProjects,
    getSkills,
    getSkillCategories,
    getCertificates,
    getExperiences,
    getSocialLinks,
    getContactMessages,
    markContactMessageAsRead,
    updatePortfolio,
    updateProject,
    updateSkill,
    updateSkillCategory,
    updateCertificate,
    updateExperience,
    updateSocialLink,
} from "../services/api";

const themes = ["ENCHANTED_ARCHIVE", "MODERN_DEVELOPER", "CYBER_TERMINAL"];
const visibilities = ["PUBLIC", "PRIVATE", "UNLISTED"];
const navItems = [
    { id: "overview", label: "Overview", path: "/dashboard", icon: "⌂" },
    { id: "themes", label: "Theme Studio", path: "/dashboard/themes", icon: "◈" },
    { id: "portfolio", label: "Portfolio", path: "/dashboard/portfolio", icon: "▣" },
    { id: "projects", label: "Projects", path: "/dashboard/projects", icon: "▤" },
    { id: "skills", label: "Skills", path: "/dashboard/skills", icon: "◇" },
    { id: "certificates", label: "Certificates", path: "/dashboard/certificates", icon: "▧" },
    { id: "social-links", label: "Social Links", path: "/dashboard/social-links", icon: "↗" },
    { id: "experience", label: "Experience", path: "/dashboard/experience", icon: "▥" },
    { id: "messages", label: "Messages", path: "/dashboard/messages", icon: "✉" },
];

const themeStudioThemes = [
    {
        id: "CYBER_TERMINAL",
        name: "Cyber Terminal",
        description: "Dark, focused, and futuristic.",
        previewClass: "theme-preview--cyber",
    },
    {
        id: "ENCHANTED_ARCHIVE",
        name: "Enchanted Archive",
        description: "Elegant, warm, and storybook-inspired.",
        previewClass: "theme-preview--archive",
    },
    {
        id: "MODERN_DEVELOPER",
        name: "Modern Developer",
        description: "Clean, confident, and professional.",
        previewClass: "theme-preview--modern",
    },
];

const emptyPortfolioForm = { title: "", slug: "", theme: themes[0], visibility: visibilities[0] };
const emptyProjectForm = {
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    thumbnailUrl: "",
    githubUrl: "",
    liveDemoUrl: "",
    featured: false,
    published: true,
};
const proficiencyOptions = [
    "",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
];

const emptySkillForm = {
    name: "",
    categoryId: "",
    proficiency: "",
};
const emptyCategoryForm = { name: "" };
const emptyCertificateForm = {
    title: "",
    issuer: "",
    description: "",
    issueDate: "",
    credentialUrl: "",
    fileUrl: "",
    published: true,
};
const emptyExperienceForm = {
    company: "",
    role: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
};

const emptySocialLinkForm = {
    platform: "",
    url: "",
};

function projectFormFromProject(project) {
    return {
        title: project.title || "",
        slug: project.slug || "",
        shortDescription: project.shortDescription || "",
        fullDescription: project.fullDescription || "",
        thumbnailUrl: project.thumbnailUrl || "",
        githubUrl: project.githubUrl || "",
        liveDemoUrl: project.liveDemoUrl || "",
        featured: project.featured,
        published: project.published,
    };
}

function skillFormFromSkill(skill) {
    return {
        name: skill.name || "",
        categoryId: skill.categoryId || "",
        proficiency: skill.proficiency || "",
    };
}

function certificateFormFromCertificate(certificate) {
    return {
        title: certificate.title || "",
        issuer: certificate.issuer || "",
        description: certificate.description || "",
        issueDate: certificate.issueDate || "",
        credentialUrl: certificate.credentialUrl || "",
        fileUrl: certificate.fileUrl || "",
        published: certificate.published,
    };
}

function experienceFormFromExperience(experience) {
    return {
        company: experience.company || "",
        role: experience.role || "",
        employmentType: experience.employmentType || "",
        location: experience.location || "",
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
        currentlyWorking: experience.currentlyWorking,
        description: experience.description || "",
    };
}

function formatDateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function sortByDisplayOrder(items) {
    return [...items].sort((first, second) => Number(first.displayOrder) - Number(second.displayOrder));
}

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [portfolio, setPortfolio] = useState(null);
    const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [skills, setSkills] = useState([]);
    const [skillCategories, setSkillCategories] = useState([]);
    const [skillForm, setSkillForm] = useState(emptySkillForm);
    const [certificates, setCertificates] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [certificateForm, setCertificateForm] = useState(emptyCertificateForm);
    const [editingCertificateId, setEditingCertificateId] = useState(null);
    const [showCertificateForm, setShowCertificateForm] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [experienceForm, setExperienceForm] = useState(emptyExperienceForm);
    const [editingExperienceId, setEditingExperienceId] = useState(null);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [socialLinks, setSocialLinks] = useState([]);
    const [socialLinkForm, setSocialLinkForm] = useState(emptySocialLinkForm);
    const [editingSocialLinkId, setEditingSocialLinkId] = useState(null);
    const [showSocialLinkForm, setShowSocialLinkForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [error, setError] = useState("");
    const [portfolioSaveMessage, setPortfolioSaveMessage] = useState("");
    const [previewTheme, setPreviewTheme] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const activeSection = navItems.find((item) => item.path === location.pathname)?.id || "overview";
    const activeNavItem = navItems.find((item) => item.id === activeSection) || navItems[0];
    const unreadMessageCount = contactMessages.filter((message) => !message.read).length;

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [location.pathname]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const portfolioData = await getMyPortfolio();
                setPortfolio(portfolioData);
                setPortfolioForm({
                    title: portfolioData.title,
                    slug: portfolioData.slug,
                    theme: portfolioData.theme,
                    visibility: portfolioData.visibility,
                });
                const [projectData, skillData, categoryData, certificateData, experienceData, socialLinkData, messageData] = await Promise.all([
                    getProjects(),
                    getSkills(),
                    getSkillCategories(),
                    getCertificates(),
                    getExperiences(),
                    getSocialLinks(),
                    getContactMessages(),
                ]);
                setProjects(sortByDisplayOrder(projectData));
                setSkills(sortByDisplayOrder(skillData));
                setSkillCategories(sortByDisplayOrder(categoryData));
                setCertificates(sortByDisplayOrder(certificateData));
                setExperiences(sortByDisplayOrder(experienceData));
                setSocialLinks(sortByDisplayOrder(socialLinkData));
                setContactMessages(messageData);
            } catch (loadError) {
                if (loadError.message === "Portfolio not found") {
                    setPortfolio(null);
                    setProjects([]);
                    setSkills([]);
                    setSkillCategories([]);
                    setCertificates([]);
                    setSocialLinks([]);
                    setContactMessages([]);
                } else {
                    setError(loadError.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handlePortfolioChange = (event) => {
        const { name, value } = event.target;
        setPortfolioForm((currentForm) => ({ ...currentForm, [name]: value }));
    };

    const handleProjectChange = (event) => {
        const { name, value, type, checked } = event.target;
        setProjectForm((currentForm) => ({
            ...currentForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSkillChange = (event) => {
        const { name, value } = event.target;
        setSkillForm((currentForm) => {
            const nextForm = { ...currentForm, [name]: value };

            return nextForm;
        });
    };

    const handleCategoryChange = (event) => {
        setCategoryForm({ name: event.target.value });
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
            const savedCategory = editingCategoryId
                ? await updateSkillCategory(editingCategoryId, categoryForm)
                : await createSkillCategory(categoryForm);
            setSkillCategories((currentCategories) => sortByDisplayOrder(editingCategoryId
                ? currentCategories.map((category) => category.id === editingCategoryId ? savedCategory : category)
                : [...currentCategories, savedCategory]));
            setCategoryForm(emptyCategoryForm);
            setEditingCategoryId(null);
            setShowCategoryForm(false);
            setPortfolioSaveMessage(editingCategoryId ? "Skill category updated." : "Skill category created.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (category) => {
        if (!window.confirm(`Delete category "${category.name}"? Skills using it will become uncategorized.`)) return;
        setError("");
        setSaving(true);
        try {
            await deleteSkillCategory(category.id);
            setSkillCategories((currentCategories) => sortByDisplayOrder(currentCategories.filter(({ id }) => id !== category.id)));
            setSkills((currentSkills) => currentSkills.map((skill) => skill.categoryId === category.id ? { ...skill, categoryId: null } : skill));
            setPortfolioSaveMessage("Skill category deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCertificateChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCertificateForm((currentForm) => ({
            ...currentForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePortfolioSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setPortfolioSaveMessage("");
        setSaving(true);
        try {
            const savedPortfolio = editingPortfolio
                ? await updatePortfolio(portfolioForm)
                : await createPortfolio(portfolioForm);
            setPortfolio(savedPortfolio);
            setPortfolioForm({
                title: savedPortfolio.title,
                slug: savedPortfolio.slug,
                theme: savedPortfolio.theme,
                visibility: savedPortfolio.visibility,
            });
            setEditingPortfolio(false);
            setPortfolioSaveMessage(`Theme saved: ${savedPortfolio.theme}. Public portfolio will reflect the new look after refresh.`);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleProjectSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        const projectPayload = {
            ...projectForm,
        };
        try {
            if (editingProjectId) {
                const updatedProject = await updateProject(editingProjectId, projectPayload);
                setProjects((currentProjects) => sortByDisplayOrder(currentProjects.map((project) => (
                    project.id === editingProjectId ? updatedProject : project
                ))));
            } else {
                const createdProject = await createProject(projectPayload);
                setProjects((currentProjects) => sortByDisplayOrder([...currentProjects, createdProject]));
            }
            setProjectForm(emptyProjectForm);
            setEditingProjectId(null);
            setShowProjectForm(false);
            setPortfolioSaveMessage(editingProjectId ? "Project updated." : "Project created.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSkillSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        const skillPayload = {
            name: skillForm.name,
            categoryId: skillForm.categoryId || null,
            proficiency: skillForm.proficiency || null,
        };
        try {
            if (editingSkillId) {
                const updatedSkill = await updateSkill(editingSkillId, skillPayload);
                setSkills((currentSkills) => sortByDisplayOrder(currentSkills.map((skill) => (
                    skill.id === editingSkillId ? updatedSkill : skill
                ))));
            } else {
                const createdSkill = await createSkill(skillPayload);
                setSkills((currentSkills) => sortByDisplayOrder([...currentSkills, createdSkill]));
            }
            setSkillForm(emptySkillForm);
            setEditingSkillId(null);
            setShowSkillForm(false);
            setPortfolioSaveMessage(editingSkillId ? "Skill updated." : "Skill created.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (skill) => {
        if (!window.confirm(`Delete skill "${skill.name}"? This cannot be undone.`)) return;
        setError("");
        setSaving(true);
        try {
            await deleteSkill(skill.id);
            setSkills((currentSkills) => sortByDisplayOrder(currentSkills.filter(({ id }) => id !== skill.id)));
            setPortfolioSaveMessage("Skill deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCertificateSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        const certificatePayload = {
            ...certificateForm,
            issuer: certificateForm.issuer || null,
            description: certificateForm.description || null,
            issueDate: certificateForm.issueDate || null,
            credentialUrl: certificateForm.credentialUrl || null,
            fileUrl: certificateForm.fileUrl || null,
        };
        try {
            if (editingCertificateId) {
                const updatedCertificate = await updateCertificate(editingCertificateId, certificatePayload);
                setCertificates((currentCertificates) => sortByDisplayOrder(currentCertificates.map((certificate) => (
                    certificate.id === editingCertificateId ? updatedCertificate : certificate
                ))));
            } else {
                const createdCertificate = await createCertificate(certificatePayload);
                setCertificates((currentCertificates) => sortByDisplayOrder([...currentCertificates, createdCertificate]));
            }
            setCertificateForm(emptyCertificateForm);
            setEditingCertificateId(null);
            setShowCertificateForm(false);
            setPortfolioSaveMessage(editingCertificateId ? "Certificate updated." : "Certificate created.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCertificate = async (certificate) => {
        if (!window.confirm(`Delete certificate "${certificate.title}"? This cannot be undone.`)) return;
        setError("");
        setSaving(true);
        try {
            await deleteCertificate(certificate.id);
            setCertificates((currentCertificates) => sortByDisplayOrder(currentCertificates.filter(({ id }) => id !== certificate.id)));
            setPortfolioSaveMessage("Certificate deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleMarkMessageAsRead = async (contactMessage) => {
        if (!contactMessage || contactMessage.read) {
            return;
        }

        setError("");
        try {
            const updatedMessage = await markContactMessageAsRead(contactMessage.id, true);
            setContactMessages((currentMessages) => currentMessages.map((message) => (
                message.id === contactMessage.id
                    ? {
                        ...message,
                        read: Boolean(updatedMessage.read),
                        status: updatedMessage.status || "READ",
                    }
                    : message
            )));
            setPortfolioSaveMessage("Message marked as read.");
        } catch (readError) {
            setError(readError.message);
        }
    };

    const handleDeleteContactMessage = async (contactMessage) => {
        if (!window.confirm("Delete this contact message? This cannot be undone.")) return;
        setError("");
        setSaving(true);
        try {
            await deleteContactMessage(contactMessage.id);
            setContactMessages((currentMessages) => currentMessages.filter(({ id }) => id !== contactMessage.id));
            setPortfolioSaveMessage("Message deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async (project) => {
        if (!window.confirm(`Delete project "${project.title}"? This cannot be undone.`)) return;
        setError("");
        setSaving(true);
        try {
            await deleteProject(project.id);
            setProjects((currentProjects) => sortByDisplayOrder(currentProjects.filter(({ id }) => id !== project.id)));
            setPortfolioSaveMessage("Project deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePortfolio = async () => {
        if (!window.confirm("Delete your portfolio? This cannot be undone.")) return;
        setError("");
        setSaving(true);
        try {
            await deletePortfolio();
            setPortfolio(null);
            setProjects([]);
            setSkills([]);
            setSkillCategories([]);
            setCertificates([]);
            setSocialLinks([]);
            setContactMessages([]);
            setPortfolioForm(emptyPortfolioForm);
            setEditingPortfolio(false);
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const cancelProjectForm = () => {
        setProjectForm(emptyProjectForm);
        setEditingProjectId(null);
        setShowProjectForm(false);
    };

    const cancelSkillForm = () => {
        setSkillForm(emptySkillForm);
        setEditingSkillId(null);
        setShowSkillForm(false);
    };

    const cancelCategoryForm = () => {
        setCategoryForm(emptyCategoryForm);
        setEditingCategoryId(null);
        setShowCategoryForm(false);
    };

    const cancelCertificateForm = () => {
        setCertificateForm(emptyCertificateForm);
        setEditingCertificateId(null);
        setShowCertificateForm(false);
    };

    const handleExperienceChange = (event) => {
        const { name, value, type, checked } = event.target;
        setExperienceForm((currentForm) => ({
            ...currentForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleExperienceSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        const experiencePayload = {
            ...experienceForm,
            company: experienceForm.company || null,
            role: experienceForm.role || null,
            employmentType: experienceForm.employmentType || null,
            location: experienceForm.location || null,
            startDate: experienceForm.startDate || null,
            endDate: experienceForm.currentlyWorking ? null : (experienceForm.endDate || null),
            currentlyWorking: experienceForm.currentlyWorking || false,
            description: experienceForm.description || null,
        };
        try {
            if (editingExperienceId) {
                const updatedExperience = await updateExperience(editingExperienceId, experiencePayload);
                setExperiences((currentExperiences) => sortByDisplayOrder(currentExperiences.map((experience) => (
                    experience.id === editingExperienceId ? updatedExperience : experience
                ))));
            } else {
                const createdExperience = await createExperience(experiencePayload);
                setExperiences((currentExperiences) => sortByDisplayOrder([...currentExperiences, createdExperience]));
            }
            setExperienceForm(emptyExperienceForm);
            setEditingExperienceId(null);
            setShowExperienceForm(false);
            setPortfolioSaveMessage(editingExperienceId ? "Experience updated." : "Experience created.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExperience = async (experience) => {
        if (!window.confirm(`Delete experience at "${experience.company}"? This cannot be undone.`)) return;
        setError("");
        setSaving(true);
        try {
            await deleteExperience(experience.id);
            setExperiences((currentExperiences) => sortByDisplayOrder(currentExperiences.filter(({ id }) => id !== experience.id)));
            setPortfolioSaveMessage("Experience deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const cancelExperienceForm = () => {
        setExperienceForm(emptyExperienceForm);
        setEditingExperienceId(null);
        setShowExperienceForm(false);
    };

    const handleSocialLinkChange = (event) => {
        const { name, value } = event.target;
        setSocialLinkForm((currentForm) => ({ ...currentForm, [name]: value }));
    };

    const handleSocialLinkSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setPortfolioSaveMessage("");
        setSaving(true);
        try {
            const savedSocialLink = editingSocialLinkId
                ? await updateSocialLink(editingSocialLinkId, socialLinkForm)
                : await createSocialLink(socialLinkForm);
            setSocialLinks((currentLinks) => sortByDisplayOrder(editingSocialLinkId
                ? currentLinks.map((socialLink) => socialLink.id === editingSocialLinkId ? savedSocialLink : socialLink)
                : [...currentLinks, savedSocialLink]));
            setSocialLinkForm(emptySocialLinkForm);
            setEditingSocialLinkId(null);
            setShowSocialLinkForm(false);
            setPortfolioSaveMessage(editingSocialLinkId ? "Social link updated." : "Social link added.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSocialLink = async (socialLink) => {
        if (!window.confirm(`Delete ${socialLink.platform} link? This cannot be undone.`)) return;
        setError("");
        setPortfolioSaveMessage("");
        setSaving(true);
        try {
            await deleteSocialLink(socialLink.id);
            setSocialLinks((currentLinks) => sortByDisplayOrder(currentLinks.filter(({ id }) => id !== socialLink.id)));
            setPortfolioSaveMessage("Social link deleted.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const cancelSocialLinkForm = () => {
        setSocialLinkForm(emptySocialLinkForm);
        setEditingSocialLinkId(null);
        setShowSocialLinkForm(false);
    };

    const navigateToSection = (section) => {
        const sectionId = section.replace("#", "");
        const item = navItems.find((navItem) => navItem.id === sectionId);
        if (item) navigate(item.path);
    };

    const openQuickAction = (section, setFormVisible) => {
        setFormVisible(true);
        navigateToSection(section);
    };

    const handleThemeApply = async (themeId) => {
        if (!portfolio) {
            setPortfolioForm((currentForm) => ({ ...currentForm, theme: themeId }));
            setEditingPortfolio(true);
            setPreviewTheme(null);
            navigateToSection("#portfolio");
            return;
        }

        setError("");
        setPortfolioSaveMessage("");
        setSaving(true);
        try {
            const savedPortfolio = await updatePortfolio({
                title: portfolio.title,
                slug: portfolio.slug,
                theme: themeId,
                visibility: portfolio.visibility,
            });
            setPortfolio(savedPortfolio);
            setPortfolioForm({
                title: savedPortfolio.title,
                slug: savedPortfolio.slug,
                theme: savedPortfolio.theme,
                visibility: savedPortfolio.visibility,
            });
            setPortfolioSaveMessage(`${themeStudioThemes.find((theme) => theme.id === themeId)?.name} is now your public portfolio theme.`);
            setPreviewTheme(null);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const statusBadge = (value) => (
        <span className="status-badge status-badge--neutral">{value || "N/A"}</span>
    );

    if (loading) {
        return (
            <div className="dashboard-page dashboard-page--loading">
                <div className="dashboard-empty-panel">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <aside className={`dashboard-sidebar ${mobileNavOpen ? "dashboard-sidebar--open" : ""}`} aria-label="Dashboard navigation">
                    <div className="sidebar-brand">
                        <div className="brand-mark">P</div>
                        <div>
                            <p className="eyebrow-label">Admin</p>
                            <h2>PortfolioHub</h2>
                        </div>
                    </div>

                    <nav id="dashboard-navigation" className="sidebar-nav">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.path}
                                className={`sidebar-link ${activeSection === item.id ? "sidebar-link--active" : ""}`}
                                onClick={(event) => {
                                    event.preventDefault();
                                    navigate(item.path);
                                    setMobileNavOpen(false);
                                }}
                            >
                                <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
                                {item.label}
                                {item.id === "messages" && unreadMessageCount > 0 && <span className="sidebar-unread-count">{unreadMessageCount}</span>}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="dashboard-main">
                    <header className="dashboard-header">
                        <div>
                            <p className="eyebrow-label">Portfolio workspace</p>
                            <h1>{activeNavItem.label}</h1>
                            <p className="dashboard-page-description">{activeSection === "overview" ? "Build something worth sharing." : `Manage your ${activeNavItem.label.toLowerCase()} in one focused workspace.`}</p>
                        </div>

                        <div className="header-actions">
                            <button
                                type="button"
                                className="dashboard-menu-button"
                                onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
                                aria-expanded={mobileNavOpen}
                                aria-controls="dashboard-navigation"
                            >
                                Menu
                            </button>
                            {user?.username && <span className="user-pill">{user.username}</span>}
                            {portfolio && portfolio.slug && (
                                <button
                                    type="button"
                                    className="secondary-button dashboard-button"
                                    onClick={() => window.open(`/p/${portfolio.slug}`, "_blank", "noopener,noreferrer")}
                                >
                                    View Public Portfolio ↗
                                </button>
                            )}
                            <button type="button" className="ghost-button dashboard-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </header>

                    {error && <p className="error-message">{error}</p>}
                    {portfolioSaveMessage && <p className="success-message">{portfolioSaveMessage}</p>}

                    <main className="dashboard-content">
                        {activeSection === "overview" && (
                        <section id="overview" className="dashboard-panel dashboard-page-view">
                            <div className="welcome-hero">
                                <div>
                                    <p className="eyebrow-label">Welcome back {user?.username ? `, ${user.username}` : ""}</p>
                                    <h2>{portfolio?.title || "Your portfolio starts here"}</h2>
                                    <p>Manage your work, refine your story, and keep your professional presence up to date.</p>
                                </div>
                                <div className="welcome-status">
                                    <span>Portfolio status</span>
                                    {statusBadge(portfolio?.visibility || "Not created")}
                                    {portfolio?.slug && (
                                        <button type="button" className="primary-button dashboard-button" onClick={() => window.open(`/p/${portfolio.slug}`, "_blank", "noopener,noreferrer")}>
                                            View Public Portfolio ↗
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="stat-grid">
                                <button type="button" className="stat-card" onClick={() => navigateToSection("#projects")}>
                                    <span className="stat-icon">⌘</span>
                                    <span>Projects</span>
                                    <strong>{projects.length}</strong>
                                    <small>Manage →</small>
                                </button>
                                <button type="button" className="stat-card" onClick={() => navigateToSection("#skills")}>
                                    <span className="stat-icon">✦</span>
                                    <span>Skills</span>
                                    <strong>{skills.length}</strong>
                                    <small>Manage →</small>
                                </button>
                                <button type="button" className="stat-card" onClick={() => navigateToSection("#experience")}>
                                    <span className="stat-icon">↗</span>
                                    <span>Experience</span>
                                    <strong>{experiences.length}</strong>
                                    <small>Manage →</small>
                                </button>
                                <button type="button" className="stat-card" onClick={() => navigateToSection("#certificates")}>
                                    <span className="stat-icon">◈</span>
                                    <span>Certificates</span>
                                    <strong>{certificates.length}</strong>
                                    <small>Manage →</small>
                                </button>
                                <button type="button" className="stat-card" onClick={() => navigateToSection("#social-links")}>
                                    <span className="stat-icon">⌁</span>
                                    <span>Social Links</span>
                                    <strong>{socialLinks.length}</strong>
                                    <small>Manage →</small>
                                </button>
                                <button type="button" className="stat-card stat-card--messages" onClick={() => navigateToSection("#messages")}>
                                    <span className="stat-icon">✉</span>
                                    <span>Unread Messages</span>
                                    <strong>{unreadMessageCount}</strong>
                                    <small>Open inbox →</small>
                                </button>
                            </div>

                            <div className="quick-actions">
                                <div>
                                    <p className="eyebrow-label">Quick actions</p>
                                    <h3>Keep your portfolio moving</h3>
                                </div>
                                <div className="quick-action-list">
                                    <button type="button" className="secondary-button dashboard-button" onClick={() => openQuickAction("#projects", setShowProjectForm)}>+ Project</button>
                                    <button type="button" className="secondary-button dashboard-button" onClick={() => openQuickAction("#skills", setShowSkillForm)}>+ Skill</button>
                                    <button type="button" className="secondary-button dashboard-button" onClick={() => openQuickAction("#experience", setShowExperienceForm)}>+ Experience</button>
                                    <button type="button" className="secondary-button dashboard-button" onClick={() => openQuickAction("#certificates", setShowCertificateForm)}>+ Certificate</button>
                                    <button type="button" className="secondary-button dashboard-button" onClick={() => openQuickAction("#social-links", setShowSocialLinkForm)}>+ Social Link</button>
                                </div>
                            </div>

                            <div className="overview-activity-grid">
                                <div className="overview-activity-card">
                                    <div className="overview-activity-header"><h3>Recent projects</h3><button type="button" onClick={() => navigateToSection("#projects")}>View all</button></div>
                                    {projects.slice(0, 3).map((project) => <button key={project.id} type="button" className="overview-list-item" onClick={() => navigateToSection("#projects")}><span>{project.title}</span><small>@{project.slug}</small></button>)}
                                    {projects.length === 0 && <p className="muted">No projects yet. Add one from Quick actions.</p>}
                                </div>
                                <div className="overview-activity-card">
                                    <div className="overview-activity-header"><h3>Inbox snapshot</h3><button type="button" onClick={() => navigateToSection("#messages")}>Open inbox</button></div>
                                     {contactMessages.slice(0, 3).map((message) => {
                                         const isRead = Boolean(message.read ?? (message.status === "READ"));
                                         return (
                                             <button key={message.id} type="button" className="overview-list-item" onClick={() => navigateToSection("#messages")}>
                                                 <span>{message.subject || "No subject"}</span>
                                                 <small className={isRead ? "" : "overview-unread"}>{isRead ? "Read" : "Unread"}</small>
                                             </button>
                                         );
                                     })}
                                    {contactMessages.length === 0 && <p className="muted">Your inbox is clear.</p>}
                                </div>
                            </div>
                        </section>
                        )}

                        {activeSection === "themes" && (
                        <section id="theme-studio" className="dashboard-panel theme-studio-panel dashboard-page-view">
                            <div className="panel-header-row">
                                <div>
                                    <p className="eyebrow-label">Theme Studio</p>
                                    <h2>Choose your portfolio personality</h2>
                                    <p className="panel-description">A fresh visual direction is one click away. Your content stays exactly the same.</p>
                                </div>
                            </div>
                            <div className="theme-card-grid">
                                {themeStudioThemes.map((theme) => {
                                    const isActive = portfolio?.theme === theme.id;
                                    return (
                                        <article key={theme.id} className={`theme-card ${isActive ? "theme-card--active" : ""}`}>
                                            <button type="button" className={`theme-preview ${theme.previewClass}`} onClick={() => setPreviewTheme(theme)} aria-label={`Preview ${theme.name}`}>
                                                <span className="theme-preview-window" />
                                                <span className="theme-preview-heading" />
                                                <span className="theme-preview-copy" />
                                                <span className="theme-preview-copy theme-preview-copy--short" />
                                                <span className="theme-preview-blocks"><i /><i /><i /></span>
                                            </button>
                                            <div className="theme-card-content">
                                                <div>
                                                    <h3>{theme.name}</h3>
                                                    <p>{theme.description}</p>
                                                </div>
                                                {isActive ? (
                                                    <span className="theme-current">✓ Current theme</span>
                                                ) : (
                                                    <button type="button" className="secondary-button dashboard-button" onClick={() => setPreviewTheme(theme)}>Preview & Apply</button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                        )}

                        {activeSection === "portfolio" && (
                        <section id="portfolio" className="dashboard-panel dashboard-page-view">
                            <div className="panel-header-row">
                                <div>
                                    <p className="eyebrow-label">Portfolio</p>
                                    <h2>Portfolio details</h2>
                                </div>
                                {!portfolio && !editingPortfolio && (
                                    <button type="button" className="primary-button dashboard-button" onClick={() => setEditingPortfolio(true)}>
                                        Create Portfolio
                                    </button>
                                )}
                            </div>

                            {!portfolio || editingPortfolio ? (
                                <form className="dashboard-form" onSubmit={handlePortfolioSubmit}>
                                    <div className="form-grid">
                                        <label>
                                            Title
                                            <input name="title" value={portfolioForm.title} onChange={handlePortfolioChange} required />
                                        </label>
                                        <label>
                                            Slug
                                            <input name="slug" value={portfolioForm.slug} onChange={handlePortfolioChange} required />
                                        </label>
                                        <label>
                                            Theme
                                            <select name="theme" value={portfolioForm.theme} onChange={handlePortfolioChange}>
                                                {themes.map((theme) => (
                                                    <option key={theme} value={theme}>{theme}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Visibility
                                            <select name="visibility" value={portfolioForm.visibility} onChange={handlePortfolioChange}>
                                                {visibilities.map((visibility) => (
                                                    <option key={visibility} value={visibility}>{visibility}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                            {saving ? "Saving..." : portfolio ? "Save Changes" : "Create Portfolio"}
                                        </button>
                                        {portfolio && (
                                            <button type="button" className="ghost-button dashboard-button" onClick={() => setEditingPortfolio(false)} disabled={saving}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div className="detail-card">
                                    <div className="detail-header">
                                        <div>
                                            <h3>{portfolio.title}</h3>
                                            <p>@{portfolio.slug}</p>
                                        </div>
                                        {statusBadge(portfolio.visibility)}
                                    </div>

                                    <div className="detail-metadata">
                                        <div>
                                            <span className="summary-label">Theme</span>
                                            <p>{portfolio.theme}</p>
                                        </div>
                                        <div>
                                            <span className="summary-label">Public URL</span>
                                            <p>/p/{portfolio.slug}</p>
                                        </div>
                                    </div>

                                    <div className="form-actions compact-actions">
                                        <button type="button" className="secondary-button dashboard-button" onClick={() => setEditingPortfolio(true)}>
                                            Edit
                                        </button>
                                        <button type="button" className="danger-button dashboard-button" onClick={handleDeletePortfolio} disabled={saving}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                        )}

                        {portfolio && (
                            <>
                                {activeSection === "projects" && (
                                <section id="projects" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Projects</p>
                                            <h2>Portfolio projects</h2>
                                        </div>
                                        {!showProjectForm && (
                                            <button type="button" className="primary-button dashboard-button" onClick={() => setShowProjectForm(true)}>
                                                Add Project
                                            </button>
                                        )}
                                    </div>

                                    {showProjectForm && (
                                        <form className="dashboard-form" onSubmit={handleProjectSubmit}>
                                            <div className="form-header-row">
                                                <h3>{editingProjectId ? "Edit project" : "Add project"}</h3>
                                            </div>
                                            <div className="form-grid">
                                                <label>
                                                    Title
                                                    <input name="title" value={projectForm.title} onChange={handleProjectChange} required />
                                                </label>
                                                <label>
                                                    Slug
                                                    <input name="slug" value={projectForm.slug} onChange={handleProjectChange} required />
                                                </label>
                                                <label className="full-width">
                                                    Short description
                                                    <textarea name="shortDescription" value={projectForm.shortDescription} onChange={handleProjectChange} rows="3" />
                                                </label>
                                                <label className="full-width">
                                                    Full description
                                                    <textarea name="fullDescription" value={projectForm.fullDescription} onChange={handleProjectChange} rows="4" />
                                                </label>
                                                <label className="full-width">
                                                    Thumbnail URL
                                                    <input name="thumbnailUrl" type="url" value={projectForm.thumbnailUrl} onChange={handleProjectChange} />
                                                </label>
                                                <label>
                                                    GitHub URL
                                                    <input name="githubUrl" type="url" value={projectForm.githubUrl} onChange={handleProjectChange} />
                                                </label>
                                                <label>
                                                    Live demo URL
                                                    <input name="liveDemoUrl" type="url" value={projectForm.liveDemoUrl} onChange={handleProjectChange} />
                                                </label>
                                            </div>

                                            <div className="checkbox-grid">
                                                <label className="checkbox-field">
                                                    <input name="featured" type="checkbox" checked={projectForm.featured} onChange={handleProjectChange} />
                                                    Featured
                                                </label>
                                                <label className="checkbox-field">
                                                    <input name="published" type="checkbox" checked={projectForm.published} onChange={handleProjectChange} />
                                                    Published
                                                </label>
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                    {saving ? "Saving..." : editingProjectId ? "Save Changes" : "Create Project"}
                                                </button>
                                                <button type="button" className="ghost-button dashboard-button" onClick={cancelProjectForm} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {projects.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No projects yet</p>
                                        </div>
                                    ) : (
                                        <div className="entity-grid project-grid">
                                            {projects.map((project) => (
                                                <article key={project.id} className="entity-card project-card">
                                                    {project.thumbnailUrl && (
                                                        <div className="project-thumbnail">
                                                            <img src={project.thumbnailUrl} alt={`${project.title} preview`} />
                                                        </div>
                                                    )}
                                                    <div className="card-top-row">
                                                        <h3>{project.title}</h3>
                                                        <div className="badge-stack">
                                                            {project.featured && <span className="status-badge status-badge--blue">Featured</span>}
                                                            {project.published ? (
                                                                <span className="status-badge status-badge--success">Published</span>
                                                            ) : (
                                                                <span className="status-badge status-badge--neutral">Unpublished</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="project-slug">@{project.slug}</p>
                                                    <p className="project-description">{project.shortDescription || "No short description"}</p>
                                                    <div className="meta-row">
                                                        <span>Display order #{project.displayOrder}</span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button dashboard-button"
                                                            onClick={() => {
                                                                setProjectForm(projectFormFromProject(project));
                                                                setEditingProjectId(project.id);
                                                                setShowProjectForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="danger-button dashboard-button"
                                                            onClick={() => handleDeleteProject(project)}
                                                            disabled={saving}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                )}

                                {activeSection === "skills" && (
                                <section id="skills" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Skills</p>
                                            <h2>Skills profile</h2>
                                        </div>
                                        {!showSkillForm && (
                                            <button type="button" className="primary-button dashboard-button" onClick={() => setShowSkillForm(true)}>
                                                Add Skill
                                            </button>
                                        )}
                                    </div>

                                    <div className="category-management">
                                        <div className="form-header-row">
                                            <h3>Skill Categories</h3>
                                            {!showCategoryForm && (
                                                <button type="button" className="secondary-button dashboard-button" onClick={() => setShowCategoryForm(true)}>
                                                    Add Category
                                                </button>
                                            )}
                                        </div>
                                        {showCategoryForm && (
                                            <form className="dashboard-form" onSubmit={handleCategorySubmit}>
                                                <label>
                                                    Category name
                                                    <input name="name" value={categoryForm.name} onChange={handleCategoryChange} required maxLength="100" />
                                                </label>
                                                <div className="form-actions">
                                                    <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                        {saving ? "Saving..." : editingCategoryId ? "Save Changes" : "Create Category"}
                                                    </button>
                                                    <button type="button" className="ghost-button dashboard-button" onClick={cancelCategoryForm} disabled={saving}>Cancel</button>
                                                </div>
                                            </form>
                                        )}
                                        {skillCategories.length > 0 && (
                                            <div className="category-list">
                                                {skillCategories.map((category) => (
                                                    <div className="category-row" key={category.id}>
                                                        <span>#{category.displayOrder} {category.name}</span>
                                                        <div className="card-actions">
                                                            <button type="button" className="secondary-button dashboard-button" onClick={() => {
                                                                setCategoryForm({ name: category.name });
                                                                setEditingCategoryId(category.id);
                                                                setShowCategoryForm(true);
                                                            }}>Edit</button>
                                                            <button type="button" className="danger-button dashboard-button" onClick={() => handleDeleteCategory(category)} disabled={saving}>Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {showSkillForm && (
                                        <form className="dashboard-form" onSubmit={handleSkillSubmit}>
                                            <div className="form-header-row">
                                                <h3>{editingSkillId ? "Edit skill" : "Add skill"}</h3>
                                            </div>
                                            <div className="form-grid">
                                                <label>
                                                    Name
                                                    <input name="name" value={skillForm.name} onChange={handleSkillChange} required />
                                                </label>
                                                <label>
                                                    Category
                                                    <select name="categoryId" value={skillForm.categoryId} onChange={handleSkillChange}>
                                                        <option value="">No category</option>
                                                        {skillCategories.map((category) => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label>
                                                    Proficiency
                                                    <select name="proficiency" value={skillForm.proficiency} onChange={handleSkillChange}>
                                                        {proficiencyOptions.map((option) => (
                                                            <option key={option || "not-specified"} value={option}>
                                                                {option || "Not specified"}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                    {saving ? "Saving..." : editingSkillId ? "Save Changes" : "Create Skill"}
                                                </button>
                                                <button type="button" className="ghost-button dashboard-button" onClick={cancelSkillForm} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {skills.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No skills yet</p>
                                        </div>
                                    ) : (
                                        <div className="entity-grid skills-grid">
                                            {skills.map((skill) => (
                                                <article key={skill.id} className="entity-card skill-card">
                                                    <div className="card-top-row">
                                                        <h3>{skill.name}</h3>
                                                        <span className="status-badge status-badge--neutral">#{skill.displayOrder}</span>
                                                    </div>
                                                    <p className="skill-proficiency">{skill.proficiency || "Proficiency not specified"}</p>
                                                    <div className="meta-row">
                                                        <span className="skill-category">Category · {skillCategories.find((category) => category.id === skill.categoryId)?.name || "Uncategorized"}</span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button dashboard-button"
                                                            onClick={() => {
                                                                setSkillForm(skillFormFromSkill(skill));
                                                                setEditingSkillId(skill.id);
                                                                setShowSkillForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="danger-button dashboard-button"
                                                            onClick={() => handleDeleteSkill(skill)}
                                                            disabled={saving}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                )}

                                {activeSection === "certificates" && (
                                <section id="certificates" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Certificates</p>
                                            <h2>Credentials</h2>
                                        </div>
                                        {!showCertificateForm && (
                                            <button type="button" className="primary-button dashboard-button" onClick={() => setShowCertificateForm(true)}>
                                                Add Certificate
                                            </button>
                                        )}
                                    </div>

                                    {showCertificateForm && (
                                        <form className="dashboard-form" onSubmit={handleCertificateSubmit}>
                                            <div className="form-header-row">
                                                <h3>{editingCertificateId ? "Edit certificate" : "Add certificate"}</h3>
                                            </div>
                                            <div className="form-grid">
                                                <label>
                                                    Title
                                                    <input name="title" value={certificateForm.title} onChange={handleCertificateChange} required maxLength="200" />
                                                </label>
                                                <label>
                                                    Issuer
                                                    <input name="issuer" value={certificateForm.issuer} onChange={handleCertificateChange} maxLength="150" />
                                                </label>
                                                <label>
                                                    Issue date
                                                    <input name="issueDate" type="date" value={certificateForm.issueDate} onChange={handleCertificateChange} />
                                                </label>
                                                <label className="full-width">
                                                    Description
                                                    <textarea name="description" value={certificateForm.description} onChange={handleCertificateChange} rows="4" />
                                                </label>
                                                <label className="full-width">
                                                    Credential URL
                                                    <input name="credentialUrl" type="url" value={certificateForm.credentialUrl} onChange={handleCertificateChange} />
                                                </label>
                                                <label className="full-width">
                                                    File URL
                                                    <input name="fileUrl" type="url" value={certificateForm.fileUrl} onChange={handleCertificateChange} />
                                                </label>
                                            </div>

                                            <label className="checkbox-field">
                                                <input name="published" type="checkbox" checked={certificateForm.published} onChange={handleCertificateChange} />
                                                Published
                                            </label>

                                            <div className="form-actions">
                                                <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                    {saving ? "Saving..." : editingCertificateId ? "Save Changes" : "Create Certificate"}
                                                </button>
                                                <button type="button" className="ghost-button dashboard-button" onClick={cancelCertificateForm} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {certificates.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No certificates yet</p>
                                        </div>
                                    ) : (
                                        <div className="entity-grid certificate-grid">
                                            {certificates.map((certificate) => (
                                                <article key={certificate.id} className="entity-card certificate-card">
                                                    <div className="card-top-row">
                                                        <div className="certificate-title"><span aria-hidden="true">✦</span><h3>{certificate.title}</h3></div>
                                                        {certificate.published ? (
                                                            <span className="status-badge status-badge--success">Published</span>
                                                        ) : (
                                                            <span className="status-badge status-badge--neutral">Unpublished</span>
                                                        )}
                                                    </div>
                                                    <p className="muted">{certificate.issuer || "Issuer not specified"}</p>
                                                    <p>{certificate.description || "No description provided"}</p>
                                                    <div className="meta-row">
                                                        <span>{certificate.issueDate ? `Issued: ${certificate.issueDate}` : "No issue date"}</span>
                                                        <span>Order: {certificate.displayOrder}</span>
                                                    </div>
                                                    {(certificate.credentialUrl || certificate.fileUrl) && (
                                                        <div className="credential-links">
                                                            {certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">View credential ↗</a>}
                                                            {certificate.fileUrl && <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer">Open file ↗</a>}
                                                        </div>
                                                    )}
                                                    <div className="card-actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button dashboard-button"
                                                            onClick={() => {
                                                                setCertificateForm(certificateFormFromCertificate(certificate));
                                                                setEditingCertificateId(certificate.id);
                                                                setShowCertificateForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="danger-button dashboard-button"
                                                            onClick={() => handleDeleteCertificate(certificate)}
                                                            disabled={saving}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                )}

                                {activeSection === "social-links" && (
                                <section id="social-links" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Social Links</p>
                                            <h2>Online presence</h2>
                                        </div>
                                        {!showSocialLinkForm && (
                                            <button type="button" className="primary-button dashboard-button" onClick={() => setShowSocialLinkForm(true)}>
                                                + Add Social Link
                                            </button>
                                        )}
                                    </div>

                                    {showSocialLinkForm && (
                                        <form className="dashboard-form" onSubmit={handleSocialLinkSubmit}>
                                            <div className="form-header-row">
                                                <h3>{editingSocialLinkId ? "Edit social link" : "Add social link"}</h3>
                                            </div>
                                            <div className="form-grid">
                                                <label>
                                                    Platform
                                                    <select
                                                        value={["GitHub", "LinkedIn", "Instagram", "X / Twitter", "YouTube", "Facebook", "Personal Website"].includes(socialLinkForm.platform) ? socialLinkForm.platform : "Other"}
                                                        onChange={(event) => setSocialLinkForm((currentForm) => ({
                                                            ...currentForm,
                                                            platform: event.target.value === "Other" ? "Other" : event.target.value,
                                                        }))}
                                                        required
                                                    >
                                                        <option value="">Select platform</option>
                                                        <option value="GitHub">GitHub</option>
                                                        <option value="LinkedIn">LinkedIn</option>
                                                        <option value="Instagram">Instagram</option>
                                                        <option value="X / Twitter">X / Twitter</option>
                                                        <option value="YouTube">YouTube</option>
                                                        <option value="Facebook">Facebook</option>
                                                        <option value="Personal Website">Personal Website</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </label>
                                                {(!["", "GitHub", "LinkedIn", "Instagram", "X / Twitter", "YouTube", "Facebook", "Personal Website"].includes(socialLinkForm.platform)) && (
                                                    <label>
                                                        Custom platform
                                                        <input
                                                            name="platform"
                                                            value={socialLinkForm.platform === "Other" ? "" : socialLinkForm.platform}
                                                            onChange={handleSocialLinkChange}
                                                            required
                                                            maxLength="100"
                                                        />
                                                    </label>
                                                )}
                                                <label>
                                                    URL
                                                    <input name="url" type="url" value={socialLinkForm.url} onChange={handleSocialLinkChange} required />
                                                </label>
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                    {saving ? "Saving..." : editingSocialLinkId ? "Save Changes" : "Create Social Link"}
                                                </button>
                                                <button type="button" className="ghost-button dashboard-button" onClick={cancelSocialLinkForm} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {socialLinks.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No social links added yet</p>
                                        </div>
                                    ) : (
                                        <div className="entity-grid social-link-grid">
                                            {socialLinks.map((socialLink) => (
                                                <article key={socialLink.id} className="entity-card social-link-card">
                                                    <div className="card-top-row">
                                                        <div className="social-platform"><span aria-hidden="true">↗</span><h3>{socialLink.platform}</h3></div>
                                                        <span className="status-badge status-badge--neutral">#{socialLink.displayOrder}</span>
                                                    </div>
                                                    <p>
                                                        <a href={socialLink.url} target="_blank" rel="noopener noreferrer">{socialLink.url}</a>
                                                    </p>
                                                    <div className="card-actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button dashboard-button"
                                                            onClick={() => {
                                                                setSocialLinkForm({ platform: socialLink.platform || "", url: socialLink.url || "" });
                                                                setEditingSocialLinkId(socialLink.id);
                                                                setShowSocialLinkForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="danger-button dashboard-button"
                                                            onClick={() => handleDeleteSocialLink(socialLink)}
                                                            disabled={saving}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                )}

                                {activeSection === "experience" && (
                                <section id="experience" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Experience</p>
                                            <h2>Work history</h2>
                                        </div>
                                        {!showExperienceForm && (
                                            <button type="button" className="primary-button dashboard-button" onClick={() => setShowExperienceForm(true)}>
                                                Add Experience
                                            </button>
                                        )}
                                    </div>

                                    {showExperienceForm && (
                                        <form className="dashboard-form" onSubmit={handleExperienceSubmit}>
                                            <div className="form-header-row">
                                                <h3>{editingExperienceId ? "Edit experience" : "Add experience"}</h3>
                                            </div>
                                            <div className="form-grid">
                                                <label>
                                                    Company
                                                    <input name="company" value={experienceForm.company} onChange={handleExperienceChange} required maxLength="200" />
                                                </label>
                                                <label>
                                                    Role
                                                    <input name="role" value={experienceForm.role} onChange={handleExperienceChange} required maxLength="200" />
                                                </label>
                                                <label>
                                                    Employment Type
                                                    <select name="employmentType" value={experienceForm.employmentType} onChange={handleExperienceChange}>
                                                        <option value="">Select employment type</option>
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Freelance">Freelance</option>
                                                        <option value="Temporary">Temporary</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </label>
                                                <label>
                                                    Location
                                                    <input name="location" value={experienceForm.location} onChange={handleExperienceChange} maxLength="150" />
                                                </label>
                                                <label>
                                                    Start Date
                                                    <input name="startDate" type="date" value={experienceForm.startDate} onChange={handleExperienceChange} required />
                                                </label>
                                                <label>
                                                    End Date
                                                    <input name="endDate" type="date" value={experienceForm.endDate} onChange={handleExperienceChange} disabled={experienceForm.currentlyWorking} />
                                                </label>
                                                <label className="full-width">
                                                    Description
                                                    <textarea name="description" value={experienceForm.description} onChange={handleExperienceChange} rows="4" />
                                                </label>
                                            </div>

                                            <label className="checkbox-field">
                                                <input name="currentlyWorking" type="checkbox" checked={experienceForm.currentlyWorking} onChange={handleExperienceChange} />
                                                Currently working here
                                            </label>

                                            <div className="form-actions">
                                                <button type="submit" className="primary-button dashboard-button" disabled={saving}>
                                                    {saving ? "Saving..." : editingExperienceId ? "Save Changes" : "Create Experience"}
                                                </button>
                                                <button type="button" className="ghost-button dashboard-button" onClick={cancelExperienceForm} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {experiences.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No experience added yet</p>
                                        </div>
                                    ) : (
                                        <div className="entity-grid experience-timeline">
                                            {experiences.map((experience) => (
                                                <article key={experience.id} className="entity-card experience-card">
                                                    <span className="timeline-marker" aria-hidden="true" />
                                                    <div className="card-top-row">
                                                        <div>
                                                            <h3>{experience.role}</h3>
                                                            <p className="muted">{experience.company}</p>
                                                        </div>
                                                    </div>
                                                    <div className="experience-details">
                                                        {experience.employmentType && <span>{experience.employmentType}</span>}
                                                        {experience.location && <span>{experience.location}</span>}
                                                    </div>
                                                    <p className="experience-dates">
                                                        {experience.startDate}
                                                        {" — "}
                                                        {experience.currentlyWorking || !experience.endDate ? "PRESENT" : experience.endDate}
                                                    </p>
                                                    {experience.description && <p>{experience.description}</p>}
                                                    <div className="meta-row">
                                                        <span>Order: {experience.displayOrder}</span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <button
                                                            type="button"
                                                            className="secondary-button dashboard-button"
                                                            onClick={() => {
                                                                setExperienceForm(experienceFormFromExperience(experience));
                                                                setEditingExperienceId(experience.id);
                                                                setShowExperienceForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="danger-button dashboard-button"
                                                            onClick={() => handleDeleteExperience(experience)}
                                                            disabled={saving}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                )}

                                {activeSection === "messages" && (
                                <section id="messages" className="dashboard-panel dashboard-page-view">
                                    <div className="panel-header-row">
                                        <div>
                                            <p className="eyebrow-label">Messages</p>
                                            <h2>Contact messages</h2>
                                        </div>
                                    </div>

                                    {contactMessages.length === 0 ? (
                                        <div className="dashboard-empty-panel">
                                            <p>No messages yet</p>
                                        </div>
                                    ) : (
                                        <div className="message-list">
                                            {contactMessages.map((contactMessage) => {
                                               const isRead = Boolean(contactMessage.read ?? (contactMessage.status === "READ"));

                                                return (
                                                    <article
                                                        key={contactMessage.id}
                                                        className={`message-card ${isRead ? "message-card--read" : "message-card--unread"}`}
                                                    >
                                                        <div className="message-header">
                                                            <div>
                                                                <h3>{contactMessage.subject || "No subject"}</h3>
                                                                <p className="muted">
                                                                    {contactMessage.name} • <a
                                                                        href={`mailto:${contactMessage.email}`}
                                                                        className="message-email"
                                                                        onClick={(event) => event.stopPropagation()}
                                                                    >
                                                                        {contactMessage.email}
                                                                    </a>
                                                                </p>
                                                            </div>
                                                            <div className="message-state">
                                                                <label className="message-read-toggle">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isRead}
                                                                        onChange={() => !isRead && handleMarkMessageAsRead(contactMessage)}
                                                                        aria-label="Mark message as read"
                                                                    />
                                                                    <span>{isRead ? "Read" : "Unread"}</span>
                                                                </label>
                                                                <span className={`status-badge ${isRead ? "status-badge--success" : "status-badge--warning"}`}>
                                                                    {contactMessage.status || "UNREAD"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="message-body">{contactMessage.message}</p>
                                                        <div className="message-footer">
                                                            <span>{formatDateTime(contactMessage.createdAt)}</span>
                                                            <button
                                                                type="button"
                                                                className="danger-button dashboard-button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    handleDeleteContactMessage(contactMessage);
                                                                }}
                                                                disabled={saving}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                                )}
                            </>
                        )}
                    </main>

                    {previewTheme && (
                        <div className="theme-modal-backdrop" role="presentation" onMouseDown={() => setPreviewTheme(null)}>
                            <section className="theme-modal" role="dialog" aria-modal="true" aria-labelledby="theme-modal-title" onMouseDown={(event) => event.stopPropagation()}>
                                <button type="button" className="theme-modal-close" onClick={() => setPreviewTheme(null)} aria-label="Close theme preview">×</button>
                                <div className={`theme-preview theme-preview--large ${previewTheme.previewClass}`}>
                                    <span className="theme-preview-window" />
                                    <span className="theme-preview-heading" />
                                    <span className="theme-preview-copy" />
                                    <span className="theme-preview-copy theme-preview-copy--short" />
                                    <span className="theme-preview-blocks"><i /><i /><i /></span>
                                </div>
                                <p className="eyebrow-label">Theme preview</p>
                                <h2 id="theme-modal-title">{previewTheme.name}</h2>
                                <p>{previewTheme.description}</p>
                                <div className="form-actions">
                                    <button type="button" className="ghost-button dashboard-button" onClick={() => setPreviewTheme(null)}>Cancel</button>
                                    <button type="button" className="primary-button dashboard-button" onClick={() => handleThemeApply(previewTheme.id)} disabled={saving || portfolio?.theme === previewTheme.id}>
                                        {saving ? "Applying..." : portfolio?.theme === previewTheme.id ? "Current Theme" : "Use This Theme"}
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
