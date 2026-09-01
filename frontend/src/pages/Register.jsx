import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import "./Login.css";

function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const normalizedEmail = email.trim();

		if (!normalizedEmail) return setError("Email is required.");
		if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError("Enter a valid email address.");
		if (!password) return setError("Password is required.");
		if (password.length < 8) return setError("Password must be at least 8 characters.");
		if (!confirmPassword) return setError("Please confirm your password.");
		if (password !== confirmPassword) return setError("Passwords do not match.");

		setError("");
		setLoading(true);
		try {
			await register(normalizedEmail, password);
			navigate("/", { replace: true, state: { registrationSuccess: "Account created. You can now sign in." } });
		} catch (registrationError) {
			setError(registrationError.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-page">
			<div className="login-grid-pattern" aria-hidden="true" />
			<main className="login-layout">
				<section className="login-intro" aria-labelledby="register-brand-title">
					<div className="login-intro-orb login-intro-orb-one" aria-hidden="true" />
					<div className="login-intro-orb login-intro-orb-two" aria-hidden="true" />
					<p className="login-product-mark"><span aria-hidden="true">◆</span> PortfolioHub</p>
					<p className="login-overline">Your work, in one place</p>
					<h1 id="register-brand-title">Build. Showcase.<br /><span>Manage.</span></h1>
					<p className="login-intro-copy">Create a polished home for your work, keep your projects organized, and publish a portfolio that moves with you.</p>
					<div className="login-code-decoration" aria-hidden="true"><span>&lt;portfolio</span><span>  mode=&quot;public&quot; /&gt;</span><span className="login-code-cursor">_</span></div>
					<div className="login-intro-footer"><span className="login-status-dot" /> Built for people who make things</div>
				</section>
				<section className="login-card" aria-labelledby="register-title">
					<div className="login-card-brand"><span aria-hidden="true">◆</span> PortfolioHub</div>
					<div className="login-card-heading">
						<p className="login-card-kicker">Create your account</p>
						<h2 id="register-title">Start building your workspace</h2>
						<p>Set up your account to begin shaping your portfolio.</p>
					</div>
					<form onSubmit={handleSubmit} noValidate>
						<div className="login-field">
							<label htmlFor="register-email">Email address</label>
							<input id="register-email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
						</div>
						<div className="login-field">
							<label htmlFor="register-password">Password</label>
							<div className="login-password-wrap">
								<input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
								<button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button>
							</div>
						</div>
						<div className="login-field">
							<label htmlFor="confirm-password">Confirm password</label>
							<div className="login-password-wrap">
								<input id="confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
								<button type="button" className="login-password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword}>{showConfirmPassword ? "Hide" : "Show"}</button>
							</div>
						</div>
						{error && <div className="login-error" role="alert" aria-live="polite"><strong>Unable to create account</strong><span>{error}</span></div>}
						<button className="login-submit" type="submit" disabled={loading}>
							{loading && <span className="login-spinner" aria-hidden="true" />}
							{loading ? "Creating account..." : "Create Account"}
							{!loading && <span aria-hidden="true">-&gt;</span>}
						</button>
					</form>
					<p className="login-card-link">Already have an account? <Link to="/">Log in</Link></p>
					<p className="login-card-note"><span aria-hidden="true">●</span> Secure workspace access</p>
				</section>
			</main>
		</div>
	);
}

export default Register;
