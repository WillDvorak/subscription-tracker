import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import "../screens/LoginAndRegisterScreen.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Handles both login and register in one form.
 * Mode is controlled by the parent (LoginAndRegisterScreen) via isLoggingIn prop,
 * but the toggle button lives here since it's part of the form card visually.
 */
export default function LoginAndRegisterForm({ isLoggingIn, setIsLoggingIn }) {

    const [, setToken] = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Clear form and error when switching between login and register
    function switchMode() {
        setIsLoggingIn((prev) => !prev);
        setError(null);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        // Client-side validation for register only
        if (!isLoggingIn && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLoggingIn ? "/api/auth/login" : "/api/auth/register";
            const body = isLoggingIn
                ? { email, password }
                : { email, password };

            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                // Try to read an error message from the backend response body
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Something went wrong.");
            }

            const data = await res.json();
            setToken(data.token); // triggers the App.jsx effect that swaps to API data
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                    className="auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {/* Confirm password only shown when registering */}
            {!isLoggingIn && (
                <div className="auth-field">
                    <label className="auth-label">Confirm Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : isLoggingIn ? "Sign In" : "Create Account"}
            </button>

            <hr className="auth-divider" />

            <div className="auth-toggle">
                {isLoggingIn ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="auth-toggle-btn" onClick={switchMode}>
                    {isLoggingIn ? "Register" : "Sign In"}
                </button>
            </div>
        </form>
    );
}
