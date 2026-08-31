import "./CyberTerminalPortfolio.css";

const navItems = [
    ["HOME", "#top"],
    ["ABOUT", "#about"],
    ["SKILLS", "#skills"],
    ["PROJECTS", "#projects"],
    ["EXPERIENCE", "#experience"],
    ["CERTIFICATES", "#certificates"],
    ["SOCIAL", "#social-links"],
    ["CONTACT", "#contact"],
];

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

function TerminalLink({ href, children }) {
    const external = !href.startsWith("#");

    return (
        <a
            className="cyber-link"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
        >
            {children} <span aria-hidden="true">↗</span>
        </a>
    );
}

function CyberTerminalPortfolio({
    portfolio,
    contactForm,
    submitting,
    error,
    success,
    onContactChange,
    onContactSubmit,
}) {
    const skills = portfolio.skills || [];
    const projects = portfolio.projects || [];
    const certificates = portfolio.certificates || [];
    const experiences = portfolio.experiences || [];
    const socialLinks = portfolio.socialLinks || [];

    return (
        <div className="cyber-terminal-theme">
            <header id="top" className="cyber-hero">
                <div className="cyber-shell">
                    <nav
                        className="cyber-nav"
                        aria-label="Main navigation"
                    >
                        <a className="cyber-brand" href="#top">
                            <span>&gt;_</span> {portfolio.title}
                        </a>

                        <button
                            className="cyber-nav-toggle"
                            type="button"
                            onClick={(event) =>
                                event.currentTarget.nextElementSibling.classList.toggle(
                                    "is-open"
                                )
                            }
                            aria-label="Toggle navigation menu"
                        >
                            MENU
                        </button>

                        <div className="cyber-nav-links">
                            {navItems.map(([label, href]) => (
                                <a key={label} href={href}>
                                    <span>&gt;_</span> {label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div className="cyber-hero-grid">
                        <div className="cyber-hero-copy cyber-reveal">
                            <p className="cyber-kicker">
                                &gt;_ PUBLIC_PORTFOLIO{" "}
                                <span className="cyber-cursor" />
                            </p>

                            <p className="cyber-greeting">
                                Hello, I&apos;m
                            </p>

                            <h1>{portfolio.title}</h1>

                            <p className="cyber-handle">
                                @{portfolio.slug}
                            </p>

                            <p className="cyber-lede">
                                A public portfolio showcasing published work,
                                technical skills, and professional credentials.
                            </p>

                            <div className="cyber-actions">
                                <a
                                    className="cyber-button cyber-button-primary"
                                    href="#projects"
                                >
                                    &gt;_ VIEW PROJECTS
                                </a>

                                <a
                                    className="cyber-button"
                                    href="#contact"
                                >
                                    &gt;_ CONTACT ME
                                </a>
                            </div>
                        </div>

                        <div
                            className="cyber-terminal-window cyber-reveal"
                            aria-label="Portfolio terminal summary"
                        >
                            <div className="cyber-window-bar">
                                <span className="cyber-lights">
                                    <i />
                                    <i />
                                    <i />
                                </span>

                                <span>user@portfolio:~</span>

                                <span>● ONLINE</span>
                            </div>

                            <div className="cyber-terminal-body">
                                <p>user@portfolio:~$ whoami</p>

                                <p className="cyber-output">
                                    &gt;_ Name      : {portfolio.title}
                                    <br />
                                    &gt;_ Portfolio : {portfolio.slug}
                                    <br />
                                    &gt;_ Status    :{" "}
                                    {portfolio.visibility || "PUBLIC"}
                                    <br />
                                    &gt;_ Theme     : CYBER_TERMINAL
                                </p>

                                <p>
                                    user@portfolio:~${" "}
                                    <span className="cyber-block-cursor" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="cyber-shell cyber-main">
                <section
                    className="cyber-stats"
                    aria-label="Portfolio summary"
                >
                    {[
                        ["PROJECTS", projects.length],
                        ["SKILLS", skills.length],
                        ["CERTIFICATES", certificates.length],
                    ].map(([label, count]) => (
                        <div className="cyber-stat" key={label}>
                            <span>&gt;_ {label}</span>
                            <strong>
                                {String(count).padStart(2, "0")}
                            </strong>
                        </div>
                    ))}
                </section>

                <section
                    id="about"
                    className="cyber-section cyber-editor"
                >
                    <div className="cyber-section-heading">
                        <span>&gt;_ ABOUT_ME</span>
                        <h2>cat profile.txt</h2>
                    </div>

                    <p>
                        This portfolio highlights the owner&apos;s published
                        work, technical strengths, and completed learning
                        milestones.
                    </p>
                </section>

                {skills.length > 0 && (
                    <section
                        id="skills"
                        className="cyber-section"
                    >
                        <div className="cyber-section-heading">
                            <span>&gt;_ TECH_STACK</span>
                            <h2>Installed modules</h2>
                        </div>

                        <div className="cyber-grid cyber-skill-grid">
                            {skills.map((skill, index) => (
                                <article
                                    className="cyber-card cyber-skill-card"
                                    key={`${skill.name}-${index}`}
                                >
                                    <h3>&gt;_ {skill.name}</h3>

                                    <p>
                                        STATUS: <b>ACTIVE</b>
                                    </p>

                                    {skill.proficiency && (
                                        <p>
                                            LEVEL:{" "}
                                            <b>{skill.proficiency}</b>
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {projects.length > 0 && (
                    <section
                        id="projects"
                        className="cyber-section"
                    >
                        <div className="cyber-section-heading">
                            <span>&gt;_ FEATURED_PROJECTS</span>
                            <h2>Application registry</h2>
                        </div>

                        <div className="cyber-grid cyber-project-grid">
                            {projects.map((project) => (
                                <article
                                    className="cyber-card cyber-project-card"
                                    key={project.id || project.title}
                                >
                                    <div className="cyber-card-bar">
                                        <span>
                                            &gt;_ {project.title}
                                        </span>
                                        <span>●</span>
                                    </div>

                                    {project.thumbnailUrl && (
                                        <img
                                            src={project.thumbnailUrl}
                                            alt={project.title}
                                        />
                                    )}

                                    {project.shortDescription && (
                                        <p>
                                            {project.shortDescription}
                                        </p>
                                    )}

                                    {project.fullDescription && (
                                        <p className="cyber-muted">
                                            {project.fullDescription}
                                        </p>
                                    )}

                                    <div className="cyber-card-links">
                                        {project.githubUrl && (
                                            <TerminalLink
                                                href={project.githubUrl}
                                            >
                                                VIEW_GITHUB
                                            </TerminalLink>
                                        )}

                                        {project.liveDemoUrl && (
                                            <TerminalLink
                                                href={project.liveDemoUrl}
                                            >
                                                OPEN_DEMO
                                            </TerminalLink>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {experiences.length > 0 && (
                    <section
                        id="experience"
                        className="cyber-section"
                    >
                        <div className="cyber-section-heading">
                            <span>&gt;_ EXPERIENCE_LOG</span>
                            <h2>cat work_history.log</h2>
                        </div>

                        <div className="cyber-grid cyber-experience-grid">
                            {experiences.map((experience, index) => (
                                <article
                                    className="cyber-card cyber-experience-card"
                                    key={
                                        experience.id ||
                                        `${experience.company}-${index}`
                                    }
                                >
                                    <div className="cyber-card-bar">
                                        <span>
                                            &gt;_ EXPERIENCE_
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <span>●</span>
                                    </div>

                                    <h3>{experience.role}</h3>

                                    <p>
                                        COMPANY:{" "}
                                        <b>{experience.company}</b>
                                    </p>

                                    {experience.employmentType && (
                                        <p>
                                            TYPE:{" "}
                                            <b>
                                                {experience.employmentType}
                                            </b>
                                        </p>
                                    )}

                                    {experience.location && (
                                        <p>
                                            LOCATION:{" "}
                                            <b>{experience.location}</b>
                                        </p>
                                    )}

                                    <p>
                                        PERIOD:{" "}
                                        <b>
                                            {formatDate(
                                                experience.startDate
                                            )}
                                            {" → "}
                                            {experience.currentlyWorking
                                                ? "PRESENT"
                                                : formatDate(
                                                      experience.endDate
                                                  )}
                                        </b>
                                    </p>

                                    {experience.description && (
                                        <p className="cyber-muted">
                                            {experience.description}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {certificates.length > 0 && (
                    <section
                        id="certificates"
                        className="cyber-section"
                    >
                        <div className="cyber-section-heading">
                            <span>&gt;_ CERTIFICATES</span>
                            <h2>Credential store</h2>
                        </div>

                        <div className="cyber-grid cyber-certificate-grid">
                            {certificates.map(
                                (certificate, index) => (
                                    <article
                                        className="cyber-card"
                                        key={`${certificate.title}-${index}`}
                                    >
                                        <p className="cyber-kicker">
                                            &gt;_ CERTIFICATE_FOUND
                                        </p>

                                        <h3>
                                            {certificate.title}
                                        </h3>

                                        {certificate.issuer && (
                                            <p>
                                                ISSUER:{" "}
                                                {certificate.issuer}
                                            </p>
                                        )}

                                        {certificate.issueDate && (
                                            <p>
                                                DATE:{" "}
                                                {formatDate(
                                                    certificate.issueDate
                                                )}
                                            </p>
                                        )}

                                        {certificate.description && (
                                            <p className="cyber-muted">
                                                {
                                                    certificate.description
                                                }
                                            </p>
                                        )}

                                        {certificate.credentialUrl && (
                                            <TerminalLink
                                                href={
                                                    certificate.credentialUrl
                                                }
                                            >
                                                VERIFY_CREDENTIAL
                                            </TerminalLink>
                                        )}

                                        {certificate.fileUrl && (
                                            <TerminalLink
                                                href={
                                                    certificate.fileUrl
                                                }
                                            >
                                                VIEW_FILE
                                            </TerminalLink>
                                        )}
                                    </article>
                                )
                            )}
                        </div>
                    </section>
                )}

                {socialLinks.length > 0 && (
                    <section
                        id="social-links"
                        className="cyber-section"
                    >
                        <div className="cyber-section-heading">
                            <span>&gt;_ SOCIAL_LINKS</span>
                            <h2>ls ./social/</h2>
                        </div>

                        <div className="cyber-card-links cyber-social-links">
                            {socialLinks.map(
                                (socialLink, index) => (
                                    <TerminalLink
                                        key={
                                            socialLink.id ||
                                            `${socialLink.platform}-${index}`
                                        }
                                        href={socialLink.url}
                                    >
                                        {socialLink.platform.toUpperCase()}
                                    </TerminalLink>
                                )
                            )}
                        </div>
                    </section>
                )}

                <section
                    id="contact"
                    className="cyber-section cyber-contact"
                >
                    <div className="cyber-section-heading">
                        <span>&gt;_ GET_IN_TOUCH</span>
                        <h2>./send_message.sh</h2>
                    </div>

                    <form onSubmit={onContactSubmit}>
                        <div className="cyber-form-grid">
                            <label>
                                name:
                                <input
                                    name="name"
                                    value={contactForm.name}
                                    onChange={onContactChange}
                                    required
                                />
                            </label>

                            <label>
                                email:
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
                            subject:
                            <input
                                name="subject"
                                value={contactForm.subject}
                                onChange={onContactChange}
                                required
                            />
                        </label>

                        <label>
                            message:
                            <textarea
                                name="message"
                                rows="5"
                                value={contactForm.message}
                                onChange={onContactChange}
                                required
                            />
                        </label>

                        {error && (
                            <p className="cyber-message cyber-error">
                                &gt;_ ERROR: {error}
                            </p>
                        )}

                        {success && (
                            <p className="cyber-message cyber-success">
                                &gt;_ MESSAGE_SENT
                                <br />
                                &gt;_ STATUS: 200 OK
                                <br />
                                &gt;_ CONNECTION_CLOSED
                            </p>
                        )}

                        <button
                            className="cyber-button cyber-button-primary"
                            type="submit"
                            disabled={submitting}
                        >
                            &gt;_{" "}
                            {submitting
                                ? "SENDING..."
                                : "./send_message.sh"}
                        </button>
                    </form>
                </section>
            </main>

            <footer className="cyber-footer">
                <div className="cyber-shell">
                    <span>user@portfolio:~$ exit</span>

                    <span>
                        &gt;_ © {new Date().getFullYear()}{" "}
                        {portfolio.title}
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default CyberTerminalPortfolio;