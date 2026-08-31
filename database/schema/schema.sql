CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_portfolio_current_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    title VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,

    theme VARCHAR(30) NOT NULL DEFAULT 'MODERN_DEVELOPER',

    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_portfolio_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_portfolio_theme
        CHECK (
            theme IN (
                'ENCHANTED_ARCHIVE',
                'MODERN_DEVELOPER',
                'CYBER_TERMINAL'
            )
        ),

    CONSTRAINT chk_portfolio_visibility
        CHECK (
            visibility IN (
                'PUBLIC',
                'PRIVATE',
                'UNLISTED'
            )
        )
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL UNIQUE,

    full_name VARCHAR(150) NOT NULL,
    headline VARCHAR(200),
    bio TEXT,
    location VARCHAR(150),

    profile_image_url TEXT,

    email VARCHAR(255),
    phone VARCHAR(30),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_profile_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    slug VARCHAR(150) NOT NULL,

    short_description VARCHAR(500),
    full_description TEXT,

    thumbnail_url TEXT,

    github_url TEXT,
    live_demo_url TEXT,

    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_project_slug_per_portfolio
        UNIQUE (portfolio_id, slug)
);

CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url TEXT
);

CREATE TABLE project_technologies (
    project_id UUID NOT NULL,
    technology_id UUID NOT NULL,

    PRIMARY KEY (project_id, technology_id),

    CONSTRAINT fk_project_technology_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_technology_technology
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE RESTRICT
);

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(150),

    description TEXT,

    issue_date DATE,

    credential_url TEXT,
    file_url TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    published BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certificate_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE
);

CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    name VARCHAR(100) NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_skill_category_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_skill_category_name
        UNIQUE (portfolio_id, name),

    CONSTRAINT uq_skill_category_portfolio_id_id
        UNIQUE (portfolio_id, id)
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,
    category_id UUID,

    name VARCHAR(100) NOT NULL,

    proficiency VARCHAR(30),

    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT uq_skill_name_per_portfolio
        UNIQUE (portfolio_id, name),

    CONSTRAINT fk_skill_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_skill_category
        FOREIGN KEY (portfolio_id, category_id)
        REFERENCES skill_categories(portfolio_id, id)
        ON DELETE SET NULL (category_id)
);

CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,

    employment_type VARCHAR(50),
    location VARCHAR(150),

    start_date DATE NOT NULL,
    end_date DATE,

    currently_working BOOLEAN NOT NULL DEFAULT FALSE,

    description TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT chk_experience_dates
        CHECK (
            end_date IS NULL OR end_date >= start_date
        ),

    CONSTRAINT fk_experience_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE
);

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150),
    field_of_study VARCHAR(150),
    grade VARCHAR(50),

    start_date DATE,
    end_date DATE,

    description TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT chk_education_dates
        CHECK (
            end_date IS NULL OR end_date >= start_date
        ),

    CONSTRAINT fk_education_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE
);

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    title VARCHAR(250) NOT NULL,
    slug VARCHAR(200) NOT NULL,

    excerpt TEXT,
    cover_image_url TEXT,

    content TEXT NOT NULL,

    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_blog_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_blog_slug_per_portfolio
        UNIQUE (portfolio_id, slug)
);

CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_social_link_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_social_platform_per_portfolio
        UNIQUE (portfolio_id, platform)
);

CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(250),
    message TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'UNREAD',
    read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contact_message_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_contact_message_status
        CHECK (
            status IN (
                'UNREAD',
                'READ',
                'ARCHIVED'
            )
        )
);

CREATE TABLE portfolio_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    portfolio_id UUID NOT NULL UNIQUE,

    resume_url TEXT,

    show_about BOOLEAN NOT NULL DEFAULT TRUE,
    show_skills BOOLEAN NOT NULL DEFAULT TRUE,
    show_projects BOOLEAN NOT NULL DEFAULT TRUE,
    show_certificates BOOLEAN NOT NULL DEFAULT TRUE,
    show_experience BOOLEAN NOT NULL DEFAULT TRUE,
    show_education BOOLEAN NOT NULL DEFAULT TRUE,
    show_blogs BOOLEAN NOT NULL DEFAULT TRUE,
    show_contact BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_portfolio_settings_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolios(id)
        ON DELETE CASCADE
);

-- Unique constraints already index their columns. Add indexes for the remaining
-- foreign keys that are commonly used to load portfolio content and enforce deletes.
CREATE INDEX idx_certificates_portfolio_id ON certificates(portfolio_id);
CREATE INDEX idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX idx_skills_category_id ON skills(category_id);
CREATE INDEX idx_experiences_portfolio_id ON experiences(portfolio_id);
CREATE INDEX idx_education_portfolio_id ON education(portfolio_id);
CREATE INDEX idx_contact_messages_portfolio_id ON contact_messages(portfolio_id);
CREATE INDEX idx_project_technologies_technology_id ON project_technologies(technology_id);
