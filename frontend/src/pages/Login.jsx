import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            // Store JWT for future authenticated API requests
            localStorage.setItem("token", data.token);

            // Store safe user information
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-grid-pattern" aria-hidden="true" />
            <main className="login-layout">
                <section className="login-intro" aria-labelledby="login-brand-title">
                    <div className="login-intro-orb login-intro-orb-one" aria-hidden="true" />
                    <div className="login-intro-orb login-intro-orb-two" aria-hidden="true" />
                    <p className="login-product-mark"><span aria-hidden="true">◆</span> PortfolioHub</p>
                    <p className="login-overline">Your work, in one place</p>
                    <h1 id="login-brand-title">Build. Showcase.<br /><span>Manage.</span></h1>
                    <p className="login-intro-copy">Create a polished home for your work, keep your projects organized, and publish a portfolio that moves with you.</p>
                    <div className="login-code-decoration" aria-hidden="true"><span>&lt;portfolio</span><span>  mode=&quot;public&quot; /&gt;</span><span className="login-code-cursor">_</span></div>
                    <div className="login-intro-footer"><span className="login-status-dot" /> Built for people who make things</div>
                </section>

                <section className="login-card" aria-labelledby="login-title">
                    <div className="login-card-brand"><span aria-hidden="true">◆</span> PortfolioHub</div>
                    <div className="login-card-heading">
                        <p className="login-card-kicker">Welcome back</p>
                        <h2 id="login-title">Sign in to continue</h2>
                        <p>Manage your portfolio from one focused workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <div className="login-password-wrap">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && <div className="login-error" role="alert" aria-live="polite"><strong>Unable to sign in</strong><span>{error}</span></div>}

                        <button className="login-submit" type="submit" disabled={loading}>
                            {loading && <span className="login-spinner" aria-hidden="true" />}
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <span aria-hidden="true">-&gt;</span>}
                        </button>
                    </form>
                    <p className="login-card-note"><span aria-hidden="true">●</span> Secure workspace access</p>
                </section>
            </main>
        </div>
    );
}

export default Login;