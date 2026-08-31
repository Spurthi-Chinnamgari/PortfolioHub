import { useState } from "react";
import "./EnchantedArchiveTheme.css";

const navItems = [
    ["HOME", "#top"],
    ["ABOUT", "#about"],
    ["SKILLS", "#skills"],
    ["EXPERIENCE", "#experience"],
    ["PROJECTS", "#projects"],
    ["CERTIFICATES", "#certificates"],
    ["SOCIAL", "#social"],
    ["CONTACT", "#contact"],
];

const fallbackDescription =
    "This portfolio highlights the owner's published work, technical strengths, and completed learning milestones.";

function formatDate(value) {
    if (!value) return "";

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          }).format(date);
}

function ArchiveLink({ href, children }) {
    return (
        <a
            className="archive-link"
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            {children} <span aria-hidden="true">-&gt;</span>
        </a>
    );
}

function EnchantedArchiveTheme({
    portfolio,
    contactForm,
    submitting,
    error,
    success,
    onContactChange,
    onContactSubmit,
}) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const skills = portfolio.skills || [];
    const projects = portfolio.projects || [];
    const certificates = portfolio.certificates || [];
    const experiences = portfolio.experiences || [];
    const socialLinks = portfolio.socialLinks || [];

    const description = portfolio.description || fallbackDescription;

    return (
        <div className="portfolio-theme-enchanted-archive">
            <div className="archive-atmosphere" aria-hidden="true">
                <span className="archive-sparkle sparkle-one">*</span>
                <span className="archive-sparkle sparkle-two">+</span>
                <span className="archive-sparkle sparkle-three">*</span>
            </div>

            <header id="top" className="archive-hero">
                <div className="archive-shell">
                    <nav className="archive-nav" aria-label="Main navigation">
                        <a className="archive-brand" href="#top">
                            <span aria-hidden="true">✦</span>{" "}
                            {portfolio.title}
                        </a>

                        <button
                            className="archive-nav-toggle"
                            type="button"
                            aria-expanded={mobileNavOpen}
                            aria-controls="archive-navigation"
                            onClick={() =>
                                setMobileNavOpen((open) => !open)
                            }
                        >
                            Menu
                        </button>

                        <div
                            id="archive-navigation"
                            className={`archive-nav-links ${
                                mobileNavOpen ? "is-open" : ""
                            }`}
                        >
                            {navItems.map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={() =>
                                        setMobileNavOpen(false)
                                    }
                                >
                                    <span aria-hidden="true">✦</span>{" "}
                                    {label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div className="archive-ornament" aria-hidden="true">
                        <span>o</span>
                        <i />
                        <span>✦</span>
                        <i />
                        <span>o</span>
                    </div>

                    <div className="archive-hero-grid">
                        <div className="archive-hero-copy">
                            <p className="archive-eyebrow">
                                Public Portfolio
                            </p>

                            <p className="archive-greeting">
                                Hello, I&apos;m
                            </p>

                            <h1>{portfolio.title}</h1>

                            <p className="archive-slug">
                                @{portfolio.slug}
                            </p>

                            <p className="archive-lede">
                                {description}
                            </p>

                            <div className="archive-actions">
                                <a
                                    className="archive-button archive-button-primary"
                                    href="#projects"
                                >
                                    View Projects
                                </a>

                                <a
                                    className="archive-button"
                                    href="#contact"
                                >
                                    Contact Me
                                </a>
                            </div>
                        </div>

                        <article className="archive-manuscript">
                            <span
                                className="archive-bookmark"
                                aria-hidden="true"
                            />

                            <span
                                className="archive-seal"
                                aria-hidden="true"
                            >
                                ✦
                            </span>

                            <div className="archive-manuscript-inner">
                                <p className="archive-manuscript-label">
                                    Archive Entry / No.{" "}
                                    {String(
                                        portfolio.slug || "folio"
                                    ).slice(0, 8)}
                                </p>

                                <h2>{portfolio.title}</h2>

                                <div className="archive-rule" />

                                <dl>
                                    <div>
                                        <dt>Name</dt>
                                        <dd>{portfolio.title}</dd>
                                    </div>

                                    <div>
                                        <dt>Portfolio</dt>
                                        <dd>@{portfolio.slug}</dd>
                                    </div>

                                    {portfolio.visibility && (
                                        <div>
                                            <dt>Status</dt>
                                            <dd>{portfolio.visibility}</dd>
                                        </div>
                                    )}

                                    {portfolio.theme && (
                                        <div>
                                            <dt>Theme</dt>
                                            <dd>{portfolio.theme}</dd>
                                        </div>
                                    )}
                                </dl>

                                <p className="archive-script">
                                    May this collection reveal good work,
                                    carefully kept.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </header>

            <main className="archive-shell archive-main">
                <section
                    className="archive-stats"
                    aria-label="Portfolio summary"
                >
                    {[
                        ["PROJECTS", projects.length, "PUBLISHED"],
                        ["SKILLS", skills.length, "KNOWN"],
                        ["CERTIFICATES", certificates.length, "EARNED"],
                    ].map(([label, count, suffix]) => (
                        <div className="archive-stat" key={label}>
                            <span
                                className="archive-stat-mark"
                                aria-hidden="true"
                            >
                                ✦
                            </span>

                            <strong>
                                {String(count).padStart(2, "0")}
                            </strong>

                            <span>
                                {label} {suffix}
                            </span>
                        </div>
                    ))}
                </section>

                {/* ABOUT */}
                <section
                    id="about"
                    className="archive-section archive-about"
                >
                    <div className="archive-section-heading">
                        <p>✦ From the Archive ✦</p>
                        <h2>About Me</h2>
                    </div>

                    <div className="archive-journal">
                        <span
                            className="archive-feather"
                            aria-hidden="true"
                        >
                            ⌁
                        </span>

                        <p>{description}</p>
                    </div>
                </section>

                {/* SKILLS */}
                {skills.length > 0 && (
                    <section id="skills" className="archive-section">
                        <div className="archive-section-heading">
                            <p>✦ Known Languages &amp; Tools ✦</p>
                            <h2>The Skillbook</h2>
                        </div>

                        <div className="archive-grid archive-skill-grid">
                            {skills.map((skill, index) => (
                                <article
                                    className="archive-card archive-skill-card"
                                    key={`${skill.name}-${index}`}
                                >
                                    <span
                                        className="archive-card-star"
                                        aria-hidden="true"
                                    >
                                        ✦
                                    </span>

                                    <h3>{skill.name}</h3>

                                    <p>
                                        STATUS:{" "}
                                        <b>ACTIVE</b>
                                    </p>

                                    {skill.proficiency ? (
                                        <p>
                                            PROFICIENCY:{" "}
                                            <b>
                                                {skill.proficiency}
                                            </b>
                                        </p>
                                    ) : (
                                        <p className="archive-muted">
                                            Proficiency not specified
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE */}
                {experiences.length > 0 && (
                    <section
                        id="experience"
                        className="archive-section archive-experience"
                    >
                        <div className="archive-section-heading">
                            <p>✦ Pages from the Journey ✦</p>
                            <h2>Work Experience</h2>
                            <span>
                                A record of roles, places, and chapters
                                along the way.
                            </span>
                        </div>

                        <div className="archive-grid archive-experience-grid">
                            {experiences.map((experience, index) => (
                                <article
                                    className="archive-card archive-experience-card"
                                    key={
                                        experience.id ||
                                        `${experience.company}-${index}`
                                    }
                                >
                                    <div className="archive-card-top">
                                        <span>
                                            Chapter /{" "}
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <span aria-hidden="true">
                                            ✦
                                        </span>
                                    </div>

                                    <h3>{experience.role}</h3>

                                    <p className="archive-experience-company">
                                        {experience.company}
                                    </p>

                                    {experience.employmentType && (
                                        <p>
                                            TYPE:{" "}
                                            <b>
                                                {
                                                    experience.employmentType
                                                }
                                            </b>
                                        </p>
                                    )}

                                    {experience.location && (
                                        <p>
                                            LOCATION:{" "}
                                            <b>
                                                {experience.location}
                                            </b>
                                        </p>
                                    )}

                                    <p>
                                        PERIOD:{" "}
                                        <b>
                                            {formatDate(
                                                experience.startDate
                                            )}{" "}
                                            -{" "}
                                            {experience.currentlyWorking
                                                ? "Present"
                                                : formatDate(
                                                      experience.endDate
                                                  )}
                                        </b>
                                    </p>

                                    {experience.description && (
                                        <p className="archive-muted archive-experience-description">
                                            {experience.description}
                                        </p>
                                    )}

                                    <span
                                        className="archive-experience-seal"
                                        aria-hidden="true"
                                    >
                                        ✦
                                    </span>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROJECTS */}
                {projects.length > 0 && (
                    <section
                        id="projects"
                        className="archive-section"
                    >
                        <div className="archive-section-heading">
                            <p>
                                ✦ Curated Works from the Archive ✦
                            </p>

                            <h2>Featured Projects</h2>
                        </div>

                        <div className="archive-grid archive-project-grid">
                            {projects.map((project) => (
                                <article
                                    className="archive-card archive-project-card"
                                    key={
                                        project.id ||
                                        project.title
                                    }
                                >
                                    <div className="archive-card-top">
                                        <span>
                                            Chapter /{" "}
                                            {project.slug ||
                                                "untitled"}
                                        </span>

                                        <span aria-hidden="true">
                                            ✧
                                        </span>
                                    </div>

                                    {project.thumbnailUrl && (
                                        <img
                                            src={project.thumbnailUrl}
                                            alt={project.title}
                                        />
                                    )}

                                    <h3>{project.title}</h3>

                                    {project.shortDescription && (
                                        <p>
                                            {
                                                project.shortDescription
                                            }
                                        </p>
                                    )}

                                    {project.fullDescription && (
                                        <p className="archive-muted">
                                            {
                                                project.fullDescription
                                            }
                                        </p>
                                    )}

                                    <p className="archive-status">
                                        STATUS:{" "}
                                        {project.published
                                            ? "PUBLISHED"
                                            : "ARCHIVED"}
                                    </p>

                                    <div className="archive-card-links">
                                        {project.githubUrl && (
                                            <ArchiveLink
                                                href={
                                                    project.githubUrl
                                                }
                                            >
                                                Open Project
                                            </ArchiveLink>
                                        )}

                                        {project.liveDemoUrl && (
                                            <ArchiveLink
                                                href={
                                                    project.liveDemoUrl
                                                }
                                            >
                                                Read More
                                            </ArchiveLink>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* CERTIFICATES */}
                {certificates.length > 0 && (
                    <section
                        id="certificates"
                        className="archive-section"
                    >
                        <div className="archive-section-heading">
                            <p>✦ Verified Credentials ✦</p>
                            <h2>Certificates</h2>
                        </div>

                        <div className="archive-grid archive-certificate-grid">
                            {certificates.map(
                                (certificate, index) => (
                                    <article
                                        className="archive-card archive-certificate-card"
                                        key={`${certificate.title}-${index}`}
                                    >
                                        <span
                                            className="archive-medallion"
                                            aria-hidden="true"
                                        >
                                            ✦
                                        </span>

                                        <h3>
                                            {certificate.title}
                                        </h3>

                                        {certificate.issuer && (
                                            <p>
                                                ISSUER:{" "}
                                                {
                                                    certificate.issuer
                                                }
                                            </p>
                                        )}

                                        {certificate.issueDate && (
                                            <p>
                                                ISSUED:{" "}
                                                {formatDate(
                                                    certificate.issueDate
                                                )}
                                            </p>
                                        )}

                                        {certificate.description && (
                                            <p className="archive-muted">
                                                {
                                                    certificate.description
                                                }
                                            </p>
                                        )}

                                        {certificate.credentialUrl && (
                                            <ArchiveLink
                                                href={
                                                    certificate.credentialUrl
                                                }
                                            >
                                                Verify Credential
                                            </ArchiveLink>
                                        )}

                                        {certificate.fileUrl && (
                                            <ArchiveLink
                                                href={
                                                    certificate.fileUrl
                                                }
                                            >
                                                View File
                                            </ArchiveLink>
                                        )}
                                    </article>
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* SOCIAL LINKS */}
                {socialLinks.length > 0 && (
                    <section
                        id="social"
                        className="archive-section archive-social"
                    >
                        <div className="archive-section-heading">
                            <p>✦ Correspondence &amp; Connections ✦</p>
                            <h2>Find Me Elsewhere</h2>
                            <span>
                                Open the pages where this portfolio
                                continues.
                            </span>
                        </div>

                        <div className="archive-grid archive-social-grid">
                            {socialLinks.map((social, index) => (
                                <article
                                    className="archive-card archive-social-card"
                                    key={
                                        social.id ||
                                        `${social.platform}-${index}`
                                    }
                                >
                                    <div className="archive-card-top">
                                        <span>
                                            Record /{" "}
                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </span>

                                        <span aria-hidden="true">
                                            ✦
                                        </span>
                                    </div>

                                    <h3>
                                        {social.platform}
                                    </h3>

                                    <p className="archive-muted">
                                        External profile
                                    </p>

                                    <div className="archive-card-links">
                                        <ArchiveLink
                                            href={social.url}
                                        >
                                            Visit{" "}
                                            {social.platform}
                                        </ArchiveLink>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* CONTACT */}
                <section
                    id="contact"
                    className="archive-section archive-contact"
                >
                    <div className="archive-section-heading">
                        <p>✦ The Final Page ✦</p>
                        <h2>Get In Touch</h2>
                        <span>
                            Let&apos;s write the next chapter together.
                        </span>
                    </div>

                    <form onSubmit={onContactSubmit}>
                        <div className="archive-form-grid">
                            <label>
                                Name
                                <input
                                    name="name"
                                    value={contactForm.name}
                                    onChange={onContactChange}
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    name="email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={onContactChange}
                                    required
                                />
                            </label>
                        </div>

                        <label>
                            Subject
                            <input
                                name="subject"
                                value={contactForm.subject}
                                onChange={onContactChange}
                                required
                            />
                        </label>

                        <label>
                            Message
                            <textarea
                                name="message"
                                rows="5"
                                value={contactForm.message}
                                onChange={onContactChange}
                                required
                            />
                        </label>

                        {error && (
                            <p className="archive-message archive-error">
                                The ink faltered: {error}
                            </p>
                        )}

                        {success && (
                            <p className="archive-message archive-success">
                                ✦ Message sent. The next chapter awaits.
                            </p>
                        )}

                        <button
                            className="archive-button archive-button-primary"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Sending..."
                                : "✦ Send Message"}
                        </button>
                    </form>
                </section>
            </main>

            <footer className="archive-footer">
                <div
                    className="archive-ornament"
                    aria-hidden="true"
                >
                    <i />
                    <span>✦ END OF ARCHIVE ✦</span>
                    <i />
                </div>

                <p>
                    © {new Date().getFullYear()}{" "}
                    {portfolio.title}
                </p>
            </footer>
        </div>
    );
}

export default EnchantedArchiveTheme;