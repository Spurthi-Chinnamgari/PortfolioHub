import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createPortfolio,
    createProject,
    createSkill,
    createCertificate,
    deletePortfolio,
    deleteProject,
    deleteSkill,
    deleteCertificate,
    deleteContactMessage,
    getMyPortfolio,
    getProjects,
    getSkills,
    getCertificates,
    getContactMessages,
    markContactMessageAsRead,
    updatePortfolio,
    updateProject,
    updateSkill,
    updateCertificate,
} from "../services/api";

const themes = ["ENCHANTED_ARCHIVE", "MODERN_DEVELOPER", "CYBER_TERMINAL"];
const visibilities = ["PUBLIC", "PRIVATE", "UNLISTED"];
const navItems = [
    { label: "Overview", href: "#overview" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Certificates", href: "#certificates" },
    { label: "Messages", href: "#messages" },
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
    displayOrder: 0,
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
    displayOrder: 0,
};
const emptyCertificateForm = {
    title: "",
    issuer: "",
    description: "",
    issueDate: "",
    credentialUrl: "",
    fileUrl: "",
    displayOrder: 0,
    published: true,
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
        displayOrder: project.displayOrder,
    };
}

function skillFormFromSkill(skill) {
    return {
        name: skill.name || "",
        categoryId: skill.categoryId || "",
        proficiency: skill.proficiency || "",
        displayOrder: skill.displayOrder,
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
        displayOrder: certificate.displayOrder,
        published: certificate.published,
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

function Dashboard() {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [skills, setSkills] = useState([]);
    const [skillForm, setSkillForm] = useState(emptySkillForm);
    const [certificates, setCertificates] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [certificateForm, setCertificateForm] = useState(emptyCertificateForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [editingCertificateId, setEditingCertificateId] = useState(null);
    const [showCertificateForm, setShowCertificateForm] = useState(false);
    const [skillOrderError, setSkillOrderError] = useState("");
    const [error, setError] = useState("");
    const [portfolioSaveMessage, setPortfolioSaveMessage] = useState("");

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

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
                const [projectData, skillData, certificateData, messageData] = await Promise.all([
                    getProjects(),
                    getSkills(),
                    getCertificates(),
                    getContactMessages(),
                ]);
                setProjects(projectData);
                setSkills(skillData);
                setCertificates(certificateData);
                setContactMessages(messageData);
            } catch (loadError) {
                if (loadError.message === "Portfolio not found") {
                    setPortfolio(null);
                    setProjects([]);
                    setSkills([]);
                    setCertificates([]);
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

    const validateSkillDisplayOrder = (displayOrderValue, currentSkillId = editingSkillId) => {
        const numericValue = Number(displayOrderValue);

        if (!Number.isFinite(numericValue) || numericValue < 0) {
            return "Display order must be 0 or greater.";
        }

        if (numericValue === 0) {
            return "";
        }

        const duplicateSkill = skills.find((skill) => skill.id !== currentSkillId && Number(skill.displayOrder) === numericValue);
        if (duplicateSkill) {
            return `Display order ${numericValue} is already in use. Please choose another order.`;
        }

        return "";
    };

    const handleSkillChange = (event) => {
        const { name, value } = event.target;
        setSkillForm((currentForm) => {
            const nextForm = { ...currentForm, [name]: value };

            if (name === "displayOrder") {
                setSkillOrderError(validateSkillDisplayOrder(value, editingSkillId));
            }

            return nextForm;
        });
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
            if (!portfolio) {
                const [projectData, skillData, certificateData, messageData] = await Promise.all([
                    getProjects(),
                    getSkills(),
                    getCertificates(),
                    getContactMessages(),
                ]);
                setProjects(projectData);
                setSkills(skillData);
                setCertificates(certificateData);
                setContactMessages(messageData);
            }
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
            displayOrder: Number(projectForm.displayOrder),
        };
        try {
            if (editingProjectId) {
                const updatedProject = await updateProject(editingProjectId, projectPayload);
                setProjects((currentProjects) => currentProjects.map((project) => (
                    project.id === editingProjectId ? updatedProject : project
                )));
            } else {
                const createdProject = await createProject(projectPayload);
                setProjects((currentProjects) => [...currentProjects, createdProject]);
            }
            setProjectForm(emptyProjectForm);
            setEditingProjectId(null);
            setShowProjectForm(false);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSkillSubmit = async (event) => {
        event.preventDefault();
        const validationMessage = validateSkillDisplayOrder(skillForm.displayOrder, editingSkillId);
        setSkillOrderError(validationMessage);

        if (validationMessage) {
            return;
        }

        setError("");
        setSaving(true);
        const skillPayload = {
            name: skillForm.name,
            categoryId: skillForm.categoryId || null,
            proficiency: skillForm.proficiency || null,
            displayOrder: Number(skillForm.displayOrder),
        };
        try {
            if (editingSkillId) {
                const updatedSkill = await updateSkill(editingSkillId, skillPayload);
                setSkills((currentSkills) => currentSkills.map((skill) => (
                    skill.id === editingSkillId ? updatedSkill : skill
                )));
            } else {
                const createdSkill = await createSkill(skillPayload);
                setSkills((currentSkills) => [...currentSkills, createdSkill]);
            }
            setSkillForm(emptySkillForm);
            setSkillOrderError("");
            setEditingSkillId(null);
            setShowSkillForm(false);
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
            setSkills((currentSkills) => currentSkills.filter(({ id }) => id !== skill.id));
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
            displayOrder: Number(certificateForm.displayOrder),
        };
        try {
            if (editingCertificateId) {
                const updatedCertificate = await updateCertificate(editingCertificateId, certificatePayload);
                setCertificates((currentCertificates) => currentCertificates.map((certificate) => (
                    certificate.id === editingCertificateId ? updatedCertificate : certificate
                )));
            } else {
                const createdCertificate = await createCertificate(certificatePayload);
                setCertificates((currentCertificates) => [...currentCertificates, createdCertificate]);
            }
            setCertificateForm(emptyCertificateForm);
            setEditingCertificateId(null);
            setShowCertificateForm(false);
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
            setCertificates((currentCertificates) => currentCertificates.filter(({ id }) => id !== certificate.id));
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const handleMarkMessageAsRead = async (contactMessage) => {
        if (!contactMessage || contactMessage.status === "READ") {
            return;
        }

        setError("");
        try {
            const updatedMessage = await markContactMessageAsRead(contactMessage.id);
            setContactMessages((currentMessages) => currentMessages.map((message) => (
                message.id === contactMessage.id ? { ...message, status: updatedMessage.status || "READ" } : message
            )));
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
            setProjects((currentProjects) => currentProjects.filter(({ id }) => id !== project.id));
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
            setCertificates([]);
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
        setSkillOrderError("");
        setEditingSkillId(null);
        setShowSkillForm(false);
    };

    const cancelCertificateForm = () => {
        setCertificateForm(emptyCertificateForm);
        setEditingCertificateId(null);
        setShowCertificateForm(false);
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
                <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
                    <div className="sidebar-brand">
                        <div className="brand-mark">P</div>
                        <div>
                            <p className="eyebrow-label">Admin</p>
                            <h2>PortfolioHub</h2>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map((item) => (
                            <a key={item.label} href={item.href} className="sidebar-link">
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="dashboard-main">
                    <header className="dashboard-header">
                        <div>
                            <p className="eyebrow-label">Dashboard</p>
                            <h1>Portfolio management</h1>
                        </div>

                        <div className="header-actions">
                            {user?.username && <span className="user-pill">{user.username}</span>}
                            {portfolio && portfolio.slug && (
                                <button
                                    type="button"
                                    className="secondary-button dashboard-button"
                                    onClick={() => window.open(`/p/${portfolio.slug}`, "_blank", "noopener,noreferrer")}
                                >
                                    View Public Portfolio
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
                        <section id="overview" className="dashboard-panel">
                            <div className="panel-header-row">
                                <div>
                                    <p className="eyebrow-label">Overview</p>
                                    <h2>Dashboard Overview</h2>
                                </div>
                            </div>

                            <div className="stat-grid">
                                <article className="stat-card">
                                    <span>Projects</span>
                                    <strong>{projects.length}</strong>
                                </article>
                                <article className="stat-card">
                                    <span>Skills</span>
                                    <strong>{skills.length}</strong>
                                </article>
                                <article className="stat-card">
                                    <span>Certificates</span>
                                    <strong>{certificates.length}</strong>
                                </article>
                                <article className="stat-card">
                                    <span>Messages</span>
                                    <strong>{contactMessages.length}</strong>
                                </article>
                            </div>

                            {portfolio ? (
                                <div className="overview-summary">
                                    <div className="summary-row">
                                        <span className="summary-label">Portfolio</span>
                                        <strong>{portfolio.title}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Status</span>
                                        {statusBadge(portfolio.visibility)}
                                    </div>
                                </div>
                            ) : (
                                <div className="dashboard-empty-panel">
                                    <p>No portfolio created yet.</p>
                                </div>
                            )}
                        </section>

                        <section id="portfolio" className="dashboard-panel">
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

                        {portfolio && (
                            <>
                                <section id="projects" className="dashboard-panel">
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
                                                <label>
                                                    Display order
                                                    <input name="displayOrder" type="number" min="0" value={projectForm.displayOrder} onChange={handleProjectChange} />
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
                                        <div className="entity-grid">
                                            {projects.map((project) => (
                                                <article key={project.id} className="entity-card">
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
                                                    <p className="muted">@{project.slug}</p>
                                                    <p>{project.shortDescription || "No short description"}</p>
                                                    <div className="meta-row">
                                                        <span>Order: {project.displayOrder}</span>
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

                                <section id="skills" className="dashboard-panel">
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
                                                    Category ID
                                                    <input name="categoryId" value={skillForm.categoryId} onChange={handleSkillChange} />
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
                                                <label>
                                                    Display order
                                                    <input
                                                        name="displayOrder"
                                                        type="number"
                                                        min="0"
                                                        value={skillForm.displayOrder}
                                                        onChange={handleSkillChange}
                                                        aria-invalid={Boolean(skillOrderError)}
                                                    />
                                                    {skillOrderError && <span className="field-error">{skillOrderError}</span>}
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
                                        <div className="entity-grid">
                                            {skills.map((skill) => (
                                                <article key={skill.id} className="entity-card">
                                                    <div className="card-top-row">
                                                        <h3>{skill.name}</h3>
                                                        <span className="status-badge status-badge--neutral">#{skill.displayOrder}</span>
                                                    </div>
                                                    <p>{skill.proficiency || "Proficiency not specified"}</p>
                                                    <div className="meta-row">
                                                        <span>Category: {skill.categoryId || "None"}</span>
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

                                <section id="certificates" className="dashboard-panel">
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
                                                <label>
                                                    Display order
                                                    <input name="displayOrder" type="number" min="0" value={certificateForm.displayOrder} onChange={handleCertificateChange} />
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
                                        <div className="entity-grid">
                                            {certificates.map((certificate) => (
                                                <article key={certificate.id} className="entity-card">
                                                    <div className="card-top-row">
                                                        <h3>{certificate.title}</h3>
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

                                <section id="messages" className="dashboard-panel">
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
                                                const isRead = contactMessage.status === "READ";

                                                return (
                                                    <article
                                                        key={contactMessage.id}
                                                        className={`message-card ${isRead ? "message-card--read" : "message-card--unread"}`}
                                                        onClick={() => handleMarkMessageAsRead(contactMessage)}
                                                        onKeyDown={(event) => {
                                                            if ((event.key === "Enter" || event.key === " ") && !isRead) {
                                                                event.preventDefault();
                                                                handleMarkMessageAsRead(contactMessage);
                                                            }
                                                        }}
                                                        role="button"
                                                        tabIndex={0}
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
                                                            <span className={`status-badge ${isRead ? "status-badge--success" : "status-badge--warning"}`}>
                                                                {contactMessage.status || "UNREAD"}
                                                            </span>
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
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
