import { useState } from "react";
import "./ModernDeveloperTheme.css";

const navItems = [
    ["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"],
    ["Certificates", "#certificates"], ["Contact", "#contact"],
];

const fallbackDescription = "This portfolio highlights the owner's published work, technical strengths, and completed learning milestones.";

function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "short", day: "numeric",
    }).format(date);
}

function ProjectLink({ href, children }) {
    return <a className="modern-text-link" href={href} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">-&gt;</span></a>;
}

function ModernDeveloperTheme({ portfolio, contactForm, submitting, error, success, onContactChange, onContactSubmit }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const skills = portfolio.skills || [];
    const projects = portfolio.projects || [];
    const certificates = portfolio.certificates || [];
    const description = portfolio.description || fallbackDescription;

    return (
        <div className="portfolio-theme-modern-developer">
            <header id="top" className="modern-header">
                <div className="modern-shell">
                    <nav className="modern-nav" aria-label="Main navigation">
                        <a className="modern-brand" href="#top"><span aria-hidden="true">PH</span>{portfolio.title}</a>
                        <button className="modern-nav-toggle" type="button" aria-expanded={mobileNavOpen} aria-controls="modern-navigation" onClick={() => setMobileNavOpen((open) => !open)}>Menu</button>
                        <div id="modern-navigation" className={`modern-nav-links ${mobileNavOpen ? "is-open" : ""}`}>
                            {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMobileNavOpen(false)}>{label}</a>)}
                        </div>
                    </nav>
                </div>
            </header>

            <main>
                <section className="modern-hero">
                    <div className="modern-shell modern-hero-grid">
                        <div className="modern-hero-copy">
                            <p className="modern-eyebrow">Developer <span aria-hidden="true">•</span> Portfolio</p>
                            <h1>{portfolio.title}</h1>
                            <p className="modern-hero-description">{description}</p>
                            <p className="modern-identity">public portfolio / @{portfolio.slug}</p>
                            <div className="modern-actions"><a className="modern-button modern-button-primary" href="#projects">View Projects <span aria-hidden="true">-&gt;</span></a><a className="modern-button modern-button-secondary" href="#contact">Contact Me</a></div>
                        </div>
                        <div className="modern-code-wrap" aria-label="Portfolio summary">
                            <div className="modern-code-panel">
                                <div className="modern-code-bar"><span><i /><i /><i /></span><span>portfolio.ts</span><span>•••</span></div>
                                <pre><code><span className="code-purple">const</span> developer = {'{'}{`\n`}  <span className="code-blue">name</span>: <span className="code-green">&quot;{portfolio.title}&quot;</span>,{`\n`}  <span className="code-blue">portfolio</span>: <span className="code-green">&quot;@{portfolio.slug}&quot;</span>,{`\n`}  <span className="code-blue">projects</span>: <span className="code-number">{projects.length}</span>,{`\n`}  <span className="code-blue">skills</span>: <span className="code-number">{skills.length}</span>,{`\n`}  <span className="code-blue">certificates</span>: <span className="code-number">{certificates.length}</span>{`\n`}{'}'};</code></pre>
                            </div>
                            <div className="modern-float-card modern-float-projects"><strong>{String(projects.length).padStart(2, "0")}</strong><span>Projects</span></div>
                            <div className="modern-float-card modern-float-skills"><strong>{String(skills.length).padStart(2, "0")}</strong><span>Skills</span></div>
                        </div>
                    </div>
                </section>

                <div className="modern-shell">
                    <section className="modern-stats" aria-label="Portfolio summary">{[["Projects", projects.length], ["Skills", skills.length], ["Certificates", certificates.length]].map(([label, count]) => <div className="modern-stat" key={label}><strong>{String(count).padStart(2, "0")}</strong><span>{label}</span></div>)}</section>

                    <section id="about" className="modern-section modern-about"><div className="modern-section-heading"><p className="modern-eyebrow">A little context</p><h2>About</h2></div><div className="modern-about-grid"><p className="modern-about-copy">{description}</p><div className="modern-profile"><p className="modern-profile-label">Developer Profile</p>{portfolio.slug && <div><span>Portfolio</span><strong>@{portfolio.slug}</strong></div>}{portfolio.visibility && <div><span>Visibility</span><strong>{portfolio.visibility}</strong></div>}{portfolio.theme && <div><span>Theme</span><strong>{portfolio.theme}</strong></div>}</div></div></section>

                    {skills.length > 0 && <section id="skills" className="modern-section"><div className="modern-section-heading"><p className="modern-eyebrow">Technologies and tools I work with.</p><h2>Skills</h2></div><div className="modern-skill-grid">{skills.map((skill, index) => <article className="modern-skill-card" key={`${skill.name}-${index}`}><div><h3>{skill.name}</h3>{skill.proficiency ? <p>{skill.proficiency}</p> : <p className="modern-muted">Proficiency not specified</p>}</div><span className="modern-skill-mark" aria-hidden="true">+</span></article>)}</div></section>}

                    {projects.length > 0 && <section id="projects" className="modern-section"><div className="modern-section-heading modern-heading-row"><div><p className="modern-eyebrow">Selected work</p><h2>Featured Projects</h2></div><span className="modern-section-count">{String(projects.length).padStart(2, "0")} total</span></div><div className="modern-project-grid">{projects.map((project) => <article className="modern-project-card" key={project.id || project.title}>{project.thumbnailUrl && <img src={project.thumbnailUrl} alt={project.title} />}{!project.thumbnailUrl && <div className="modern-project-placeholder" aria-hidden="true">{project.title?.slice(0, 1) || "P"}</div>}<div className="modern-project-body"><div className="modern-project-meta"><span>{project.slug || "Project"}</span>{project.published && <span className="modern-published">Published</span>}</div><h3>{project.title}</h3>{project.shortDescription && <p>{project.shortDescription}</p>}{project.fullDescription && <p className="modern-muted">{project.fullDescription}</p>}<div className="modern-project-links">{project.githubUrl && <ProjectLink href={project.githubUrl}>View Project</ProjectLink>}{project.liveDemoUrl && <ProjectLink href={project.liveDemoUrl}>Live Demo</ProjectLink>}</div></div></article>)}</div></section>}

                    {certificates.length > 0 && <section id="certificates" className="modern-section"><div className="modern-section-heading"><p className="modern-eyebrow">Proof of progress</p><h2>Certificates &amp; Credentials</h2></div><div className="modern-certificate-grid">{certificates.map((certificate, index) => <article className="modern-certificate-card" key={`${certificate.title}-${index}`}><div className="modern-certificate-icon" aria-hidden="true">✓</div><div><h3>{certificate.title}</h3>{certificate.issuer && <p>{certificate.issuer}</p>}{certificate.issueDate && <span>Issued {formatDate(certificate.issueDate)}</span>}{certificate.published && <span className="modern-published">Published</span>}{certificate.credentialUrl && <div><ProjectLink href={certificate.credentialUrl}>Verify Credential</ProjectLink></div>}{certificate.fileUrl && <div><ProjectLink href={certificate.fileUrl}>View File</ProjectLink></div>}</div></article>)}</div></section>}

                    <section id="contact" className="modern-section modern-contact"><div className="modern-contact-intro"><p className="modern-eyebrow">Have a project in mind?</p><h2>Let&apos;s work together.</h2><p>A direct line for portfolio conversations, opportunities, and the next piece of work.</p>{portfolio.visibility && <span className="modern-availability"><i /> Portfolio is {portfolio.visibility.toLowerCase()}</span>}</div><form className="modern-contact-form" onSubmit={onContactSubmit}><div className="modern-form-grid"><label>Name<input name="name" value={contactForm.name} onChange={onContactChange} required /></label><label>Email<input name="email" type="email" value={contactForm.email} onChange={onContactChange} required /></label></div><label>Subject<input name="subject" value={contactForm.subject} onChange={onContactChange} required /></label><label>Message<textarea name="message" rows="5" value={contactForm.message} onChange={onContactChange} required /></label>{error && <p className="modern-message modern-error" role="alert" aria-live="polite">Unable to send message: {error}</p>}{success && <p className="modern-message modern-success" role="status" aria-live="polite">Your message was sent successfully.</p>}<button className="modern-button modern-button-primary" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"} <span aria-hidden="true">-&gt;</span></button></form></section>
                </div>
            </main>
            <footer className="modern-footer"><div className="modern-shell"><span>© {new Date().getFullYear()} {portfolio.title}</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div></footer>
        </div>
    );
}

export default ModernDeveloperTheme;
