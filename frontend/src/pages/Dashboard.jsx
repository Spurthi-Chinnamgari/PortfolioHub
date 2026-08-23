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
    getMyPortfolio,
    getProjects,
    getSkills,
    getCertificates,
    updatePortfolio,
    updateProject,
    updateSkill,
    updateCertificate,
} from "../services/api";

const themes = ["ENCHANTED_ARCHIVE", "MODERN_DEVELOPER", "CYBER_TERMINAL"];
const visibilities = ["PUBLIC", "PRIVATE", "UNLISTED"];
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

function Dashboard() {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [portfolioForm, setPortfolioForm] = useState(emptyPortfolioForm);
    const [projects, setProjects] = useState([]);
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [skills, setSkills] = useState([]);
    const [skillForm, setSkillForm] = useState(emptySkillForm);
    const [certificates, setCertificates] = useState([]);
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
    const [error, setError] = useState("");

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
                const [projectData, skillData, certificateData] = await Promise.all([
                    getProjects(),
                    getSkills(),
                    getCertificates(),
                ]);
                setProjects(projectData);
                setSkills(skillData);
                setCertificates(certificateData);
            } catch (loadError) {
                if (loadError.message === "Portfolio not found") {
                    setPortfolio(null);
                    setProjects([]);
                    setSkills([]);
                    setCertificates([]);
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
        setSkillForm((currentForm) => ({ ...currentForm, [name]: value }));
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
            if (!portfolio) {
                const [projectData, skillData, certificateData] = await Promise.all([
                    getProjects(),
                    getSkills(),
                    getCertificates(),
                ]);
                setProjects(projectData);
                setSkills(skillData);
                setCertificates(certificateData);
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

    const cancelCertificateForm = () => {
        setCertificateForm(emptyCertificateForm);
        setEditingCertificateId(null);
        setShowCertificateForm(false);
    };

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>
            <button type="button" onClick={handleLogout}>Log out</button>
            {error && <p className="error-message">{error}</p>}

            {!portfolio || editingPortfolio ? (
                <section>
                    <h2>{portfolio ? "Edit Portfolio" : "Create your portfolio"}</h2>
                    <form onSubmit={handlePortfolioSubmit}>
                        <label htmlFor="portfolio-title">Title</label>
                        <input id="portfolio-title" name="title" value={portfolioForm.title} onChange={handlePortfolioChange} required />
                        <label htmlFor="portfolio-slug">Slug</label>
                        <input id="portfolio-slug" name="slug" value={portfolioForm.slug} onChange={handlePortfolioChange} required />
                        <label htmlFor="portfolio-theme">Theme</label>
                        <select id="portfolio-theme" name="theme" value={portfolioForm.theme} onChange={handlePortfolioChange}>
                            {themes.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
                        </select>
                        <label htmlFor="portfolio-visibility">Visibility</label>
                        <select id="portfolio-visibility" name="visibility" value={portfolioForm.visibility} onChange={handlePortfolioChange}>
                            {visibilities.map((visibility) => <option key={visibility} value={visibility}>{visibility}</option>)}
                        </select>
                        <button type="submit" disabled={saving}>{saving ? "Saving..." : portfolio ? "Save Changes" : "Create Portfolio"}</button>
                        {portfolio && <button type="button" onClick={() => setEditingPortfolio(false)} disabled={saving}>Cancel</button>}
                    </form>
                </section>
            ) : (
                <section>
                    <h2>{portfolio.title}</h2>
                    <p>Slug: {portfolio.slug}</p>
                    <p>Theme: {portfolio.theme}</p>
                    <p>Visibility: {portfolio.visibility}</p>
                    <button type="button" onClick={() => setEditingPortfolio(true)}>Edit Portfolio</button>
                    <button type="button" onClick={handleDeletePortfolio} disabled={saving}>Delete Portfolio</button>
                </section>
            )}

            {portfolio && (
                <section>
                    <h2>Projects</h2>
                    {!showProjectForm && <button type="button" onClick={() => setShowProjectForm(true)}>Add Project</button>}
                    {showProjectForm && (
                        <form onSubmit={handleProjectSubmit}>
                            <h3>{editingProjectId ? "Edit Project" : "Add Project"}</h3>
                            <label htmlFor="project-title">Title</label>
                            <input id="project-title" name="title" value={projectForm.title} onChange={handleProjectChange} required />
                            <label htmlFor="project-slug">Slug</label>
                            <input id="project-slug" name="slug" value={projectForm.slug} onChange={handleProjectChange} required />
                            <label htmlFor="short-description">Short description</label>
                            <textarea id="short-description" name="shortDescription" value={projectForm.shortDescription} onChange={handleProjectChange} />
                            <label htmlFor="full-description">Full description</label>
                            <textarea id="full-description" name="fullDescription" value={projectForm.fullDescription} onChange={handleProjectChange} />
                            <label htmlFor="thumbnail-url">Thumbnail URL</label>
                            <input id="thumbnail-url" name="thumbnailUrl" type="url" value={projectForm.thumbnailUrl} onChange={handleProjectChange} />
                            <label htmlFor="github-url">GitHub URL</label>
                            <input id="github-url" name="githubUrl" type="url" value={projectForm.githubUrl} onChange={handleProjectChange} />
                            <label htmlFor="live-demo-url">Live demo URL</label>
                            <input id="live-demo-url" name="liveDemoUrl" type="url" value={projectForm.liveDemoUrl} onChange={handleProjectChange} />
                            <label><input name="featured" type="checkbox" checked={projectForm.featured} onChange={handleProjectChange} /> Featured</label>
                            <label><input name="published" type="checkbox" checked={projectForm.published} onChange={handleProjectChange} /> Published</label>
                            <label htmlFor="display-order">Display order</label>
                            <input id="display-order" name="displayOrder" type="number" min="0" value={projectForm.displayOrder} onChange={handleProjectChange} />
                            <button type="submit" disabled={saving}>{saving ? "Saving..." : editingProjectId ? "Save Changes" : "Create Project"}</button>
                            <button type="button" onClick={cancelProjectForm} disabled={saving}>Cancel</button>
                        </form>
                    )}
                    {projects.length === 0 ? <p>No projects yet</p> : (
                        <div>
                            {projects.map((project) => (
                                <article key={project.id}>
                                    <h3>{project.title}</h3>
                                    <p>Slug: {project.slug}</p>
                                    <p>Short description: {project.shortDescription || "None"}</p>
                                    <p>Full description: {project.fullDescription || "None"}</p>
                                    <p>Thumbnail URL: {project.thumbnailUrl || "None"}</p>
                                    <p>GitHub URL: {project.githubUrl || "None"}</p>
                                    <p>Live demo URL: {project.liveDemoUrl || "None"}</p>
                                    <p>Featured: {project.featured ? "Yes" : "No"}</p>
                                    <p>Published: {project.published ? "Yes" : "No"}</p>
                                    <p>Display order: {project.displayOrder}</p>
                                    <p>Project ID: {project.id}</p>
                                    <p>Portfolio ID: {project.portfolioId}</p>
                                    <p>Created: {project.createdAt}</p>
                                    <p>Updated: {project.updatedAt}</p>
                                    <button type="button" onClick={() => {
                                        setProjectForm(projectFormFromProject(project));
                                        setEditingProjectId(project.id);
                                        setShowProjectForm(true);
                                    }}>Edit</button>
                                    <button type="button" onClick={() => handleDeleteProject(project)} disabled={saving}>Delete</button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {portfolio && (
                <section>
                    <h2>Certificates</h2>
                    {!showCertificateForm && (
                        <button type="button" onClick={() => setShowCertificateForm(true)}>
                            Add Certificate
                        </button>
                    )}
                    {showCertificateForm && (
                        <form onSubmit={handleCertificateSubmit}>
                            <h3>{editingCertificateId ? "Edit Certificate" : "Add Certificate"}</h3>
                            <label htmlFor="certificate-title">Title</label>
                            <input id="certificate-title" name="title" value={certificateForm.title} onChange={handleCertificateChange} required maxLength="200" />
                            <label htmlFor="certificate-issuer">Issuer</label>
                            <input id="certificate-issuer" name="issuer" value={certificateForm.issuer} onChange={handleCertificateChange} maxLength="150" />
                            <label htmlFor="certificate-description">Description</label>
                            <textarea id="certificate-description" name="description" value={certificateForm.description} onChange={handleCertificateChange} />
                            <label htmlFor="certificate-issue-date">Issue date</label>
                            <input id="certificate-issue-date" name="issueDate" type="date" value={certificateForm.issueDate} onChange={handleCertificateChange} />
                            <label htmlFor="certificate-credential-url">Credential URL</label>
                            <input id="certificate-credential-url" name="credentialUrl" type="url" value={certificateForm.credentialUrl} onChange={handleCertificateChange} />
                            <label htmlFor="certificate-file-url">File URL</label>
                            <input id="certificate-file-url" name="fileUrl" type="url" value={certificateForm.fileUrl} onChange={handleCertificateChange} />
                            <label htmlFor="certificate-display-order">Display order</label>
                            <input id="certificate-display-order" name="displayOrder" type="number" min="0" value={certificateForm.displayOrder} onChange={handleCertificateChange} />
                            <label><input name="published" type="checkbox" checked={certificateForm.published} onChange={handleCertificateChange} /> Published</label>
                            <button type="submit" disabled={saving}>{saving ? "Saving..." : editingCertificateId ? "Save Changes" : "Create Certificate"}</button>
                            <button type="button" onClick={cancelCertificateForm} disabled={saving}>Cancel</button>
                        </form>
                    )}
                    {certificates.length === 0 ? <p>No certificates yet</p> : (
                        <div>
                            {certificates.map((certificate) => (
                                <article key={certificate.id}>
                                    <h3>{certificate.title}</h3>
                                    <p>Issuer: {certificate.issuer || "None"}</p>
                                    <p>Description: {certificate.description || "None"}</p>
                                    <p>Issue date: {certificate.issueDate || "None"}</p>
                                    <p>Credential URL: {certificate.credentialUrl || "None"}</p>
                                    <p>File URL: {certificate.fileUrl || "None"}</p>
                                    <p>Display order: {certificate.displayOrder}</p>
                                    <p>Published: {certificate.published ? "Yes" : "No"}</p>
                                    <button type="button" onClick={() => {
                                        setCertificateForm(certificateFormFromCertificate(certificate));
                                        setEditingCertificateId(certificate.id);
                                        setShowCertificateForm(true);
                                    }}>Edit</button>
                                    <button type="button" onClick={() => handleDeleteCertificate(certificate)} disabled={saving}>Delete</button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {portfolio && (
                <section>
                    <h2>Skills</h2>
                    {!showSkillForm && <button type="button" onClick={() => setShowSkillForm(true)}>Add Skill</button>}
                    {showSkillForm && (
                        <form onSubmit={handleSkillSubmit}>
                            <h3>{editingSkillId ? "Edit Skill" : "Add Skill"}</h3>
                            <label htmlFor="skill-name">Name</label>
                            <input id="skill-name" name="name" value={skillForm.name} onChange={handleSkillChange} required />
                            <label htmlFor="skill-category-id">Category ID (optional)</label>
                            <input id="skill-category-id" name="categoryId" type="text" value={skillForm.categoryId} onChange={handleSkillChange} />
                            <label htmlFor="skill-proficiency">Proficiency</label>
                            <input id="skill-proficiency" name="proficiency" maxLength="30" value={skillForm.proficiency} onChange={handleSkillChange} />
                            <label htmlFor="skill-display-order">Display order</label>
                            <input id="skill-display-order" name="displayOrder" type="number" min="0" value={skillForm.displayOrder} onChange={handleSkillChange} />
                            <button type="submit" disabled={saving}>{saving ? "Saving..." : editingSkillId ? "Save Changes" : "Create Skill"}</button>
                            <button type="button" onClick={cancelSkillForm} disabled={saving}>Cancel</button>
                        </form>
                    )}
                    {skills.length === 0 ? <p>No skills yet</p> : (
                        <div>
                            {skills.map((skill) => (
                                <article key={skill.id}>
                                    <h3>{skill.name}</h3>
                                    <p>Category ID: {skill.categoryId || "None"}</p>
                                    <p>Proficiency: {skill.proficiency || "None"}</p>
                                    <p>Display order: {skill.displayOrder}</p>
                                    <p>Skill ID: {skill.id}</p>
                                    <p>Portfolio ID: {skill.portfolioId}</p>
                                    <button type="button" onClick={() => {
                                        setSkillForm(skillFormFromSkill(skill));
                                        setEditingSkillId(skill.id);
                                        setShowSkillForm(true);
                                    }}>Edit</button>
                                    <button type="button" onClick={() => handleDeleteSkill(skill)} disabled={saving}>Delete</button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default Dashboard;
