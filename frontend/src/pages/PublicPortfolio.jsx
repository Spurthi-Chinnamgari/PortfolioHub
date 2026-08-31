import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicPortfolio, sendContactMessage } from "../services/api";
import CyberTerminalPortfolio from "../themes/CyberTerminalPortfolio";
import EnchantedArchiveTheme from "../themes/EnchantedArchiveTheme";
import ModernDeveloperTheme from "../themes/ModernDeveloperTheme";

const emptyContactForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

const navItems = [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Certificates", href: "#certificates" },
    { label: "Contact", href: "#contact" },
];

function formatIssueDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateValue;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "short", day: "numeric",
    }).format(date);
}

function PublicPortfolio() {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [contactForm, setContactForm] = useState(emptyContactForm);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const data = await getPublicPortfolio(slug);
                setPortfolio(data);
            } catch (loadError) {
                setError(loadError.message);
            } finally {
                setLoading(false);
            }
        };

        loadPortfolio();
    }, [slug]);

    const handleContactChange = (event) => {
        const { name, value } = event.target;
        setContactForm((currentForm) => ({ ...currentForm, [name]: value }));
    };

    const handleContactSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await sendContactMessage(slug, contactForm);
            setContactForm(emptyContactForm);
            setSuccess("Your message was sent successfully.");
        } catch (submitError) {
            setError(submitError.message || "Unable to send message right now.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="public-page public-page--loading">Loading portfolio...</div>;
    }

    if (error || !portfolio) {
        return (
            <div className="public-page public-page--error">
                <div className="page-shell">
                    <h1>Portfolio not found</h1>
                    <p>The requested portfolio is unavailable or not public.</p>
                </div>
            </div>
        );
    }

    const themeKey = String(portfolio.theme || "MODERN_DEVELOPER").toUpperCase();

    if (themeKey === "CYBER_TERMINAL") {
        return (
            <CyberTerminalPortfolio
                portfolio={portfolio}
                contactForm={contactForm}
                submitting={submitting}
                error={error}
                success={success}
                onContactChange={handleContactChange}
                onContactSubmit={handleContactSubmit}
            />
        );
    }

    if (themeKey === "ENCHANTED_ARCHIVE") {
        return (
            <EnchantedArchiveTheme
                portfolio={portfolio}
                contactForm={contactForm}
                submitting={submitting}
                error={error}
                success={success}
                onContactChange={handleContactChange}
                onContactSubmit={handleContactSubmit}
            />
        );
    }

    if (themeKey === "MODERN_DEVELOPER") {
        return (
            <ModernDeveloperTheme
                portfolio={portfolio}
                contactForm={contactForm}
                submitting={submitting}
                error={error}
                success={success}
                onContactChange={handleContactChange}
                onContactSubmit={handleContactSubmit}
            />
        );
    }

    const themeClassName = `portfolio-theme-${themeKey.toLowerCase().replace(/_/g, "-")}`;
    const skillCount = portfolio.skills?.length ?? 0;
    const projectCount = portfolio.projects?.length ?? 0;
    const certificateCount = portfolio.certificates?.length ?? 0;

    return (
        <div className={`public-page ${themeClassName}`} data-theme={themeKey}>
            <header id="top" className="public-hero">
                <div className="page-shell">
                    <nav className="top-nav" aria-label="Main navigation">
                        <a className="brand" href="#top">{portfolio.title}</a>
                        <button
                            type="button"
                            className="nav-toggle"
                            aria-expanded={mobileNavOpen}
                            aria-label="Toggle navigation menu"
                            onClick={() => setMobileNavOpen((currentValue) => !currentValue)}
                        >
                            Menu
                        </button>
                        <div className={`nav-links ${mobileNavOpen ? "is-open" : ""}`}>
                            {navItems.map((item) => (
                                <a key={item.label} href={item.href} onClick={() => setMobileNavOpen(false)}>
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div className="hero-content">
                        <span className="eyebrow">{portfolio.visibility}</span>
                        <h1>{portfolio.title}</h1>
                        <p className="hero-subtitle">@{portfolio.slug}</p>
                        <p className="hero-intro">
                            A public portfolio showcasing published work, technical skills, and professional credentials.
                        </p>
                        <div className="hero-actions">
                            <a href="#projects" className="primary-button">View Projects</a>
                            <a href="#contact" className="secondary-button">Contact Me</a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="page-shell public-main">
                <section id="about" className="public-section">
                    <div className="section-heading">
                        <p className="section-label">About</p>
                        <h2>Profile</h2>
                    </div>
                    <p className="section-copy">
                        This portfolio highlights the owner&apos;s published work, technical strengths, and completed learning milestones.
                    </p>
                    <div className="stats-grid" aria-label="Portfolio summary">
                        <article className="stat-card">
                            <span className="stat-label">Skills</span>
                            <strong>{skillCount}</strong>
                        </article>
                        <article className="stat-card">
                            <span className="stat-label">Projects</span>
                            <strong>{projectCount}</strong>
                        </article>
                        <article className="stat-card">
                            <span className="stat-label">Certificates</span>
                            <strong>{certificateCount}</strong>
                        </article>
                    </div>
                </section>

                {portfolio.skills && portfolio.skills.length > 0 && (
                    <section id="skills" className="public-section">
                        <div className="section-heading">
                            <p className="section-label">Skills</p>
                            <h2>Capabilities</h2>
                        </div>
                        <div className="skill-grid">
                            {portfolio.skills.map((skill, index) => (
                                <article key={`${skill.name}-${index}`} className="info-card skill-card">
                                    <h3>{skill.name}</h3>
                                    <p>{skill.proficiency || "Active skill"}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {portfolio.projects && portfolio.projects.length > 0 && (
                    <section id="projects" className="public-section">
                        <div className="section-heading">
                            <p className="section-label">Work</p>
                            <h2>Projects</h2>
                        </div>
                        <div className="card-list project-list">
                            {portfolio.projects.map((project) => (
                                <article key={project.id} className="portfolio-card project-card">
                                    {project.thumbnailUrl ? (
                                        <img src={project.thumbnailUrl} alt={project.title} className="project-image" />
                                    ) : (
                                        <div className="project-image project-image--fallback" aria-label={`Project preview for ${project.title}`}>
                                            <span>{project.title}</span>
                                        </div>
                                    )}
                                    <div className="project-body">
                                        <h3>{project.title}</h3>
                                        {project.shortDescription && <p>{project.shortDescription}</p>}
                                        {project.fullDescription && (
                                            <p className="project-description">{project.fullDescription}</p>
                                        )}
                                        <div className="project-links">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                                                    GitHub
                                                </a>
                                            )}
                                            {project.liveDemoUrl && (
                                                <a href={project.liveDemoUrl} target="_blank" rel="noreferrer">
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {portfolio.certificates && portfolio.certificates.length > 0 && (
                    <section id="certificates" className="public-section">
                        <div className="section-heading">
                            <p className="section-label">Credentials</p>
                            <h2>Certificates</h2>
                        </div>
                        <div className="card-list certificate-list">
                            {portfolio.certificates.map((certificate, index) => (
                                <article key={`${certificate.title}-${index}`} className="portfolio-card certificate-card">
                                    <div className="certificate-header">
                                        <h3>{certificate.title}</h3>
                                    </div>
                                    {certificate.issuer && <p className="meta">Issuer: {certificate.issuer}</p>}
                                    {certificate.issueDate && <p className="meta">Issued: {formatIssueDate(certificate.issueDate)}</p>}
                                    {certificate.description && <p>{certificate.description}</p>}
                                    <div className="project-links">
                                        {certificate.credentialUrl && (
                                            <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">
                                                View Credential
                                            </a>
                                        )}
                                        {certificate.fileUrl && (
                                            <a href={certificate.fileUrl} target="_blank" rel="noreferrer">
                                                View File
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                <section id="contact" className="public-section contact-section">
                    <div className="section-heading">
                        <p className="section-label">Contact</p>
                        <h2>Contact Me</h2>
                    </div>
                    <form className="contact-form" onSubmit={handleContactSubmit}>
                        <div className="form-grid">
                            <label>
                                Name
                                <input
                                    name="name"
                                    type="text"
                                    value={contactForm.name}
                                    onChange={handleContactChange}
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    name="email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={handleContactChange}
                                    required
                                />
                            </label>
                        </div>
                        <label>
                            Subject
                            <input
                                name="subject"
                                type="text"
                                value={contactForm.subject}
                                onChange={handleContactChange}
                                required
                            />
                        </label>
                        <label>
                            Message
                            <textarea
                                name="message"
                                rows="5"
                                value={contactForm.message}
                                onChange={handleContactChange}
                                required
                            />
                        </label>
                        {error && <p className="form-message form-message-error">{error}</p>}
                        {success && <p className="form-message form-message-success">{success}</p>}
                        <button type="submit" className="submit-button" disabled={submitting}>
                            {submitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </section>
            </main>

            <footer className="public-footer">
                <div className="page-shell footer-inner">
                    <p>© {new Date().getFullYear()} {portfolio.title}</p>
                    <a href="#top">Back to top</a>
                </div>
            </footer>
        </div>
    );
}

export default PublicPortfolio;
