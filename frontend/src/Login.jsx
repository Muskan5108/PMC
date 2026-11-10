
import { useState } from "react";
import "./Login.css";

export default function Login({ onBack }) {
  const [role, setRole] = useState("USER");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Connecting to PMC server...");

    const endpoint = isRegister
      ? "/api/auth/register"
      : "/api/auth/login";

    const payload = isRegister
      ? { name, email, password }
      : { email, password, role };

    try {
      const response = await fetch(
        `http://localhost:8080${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Request failed. Please try again.");
      }

      setMessage(data.message || "Request successful!");
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "PMC server se connection nahi hua. Backend check karo."
          : error.message
      );
    }
  }

  function changeRole(nextRole) {
    setRole(nextRole);
    setMessage("");
  }

  return (
    <main className="auth-page">
      <button className="back-home" onClick={onBack}>
        ← Back to Home
      </button>

      <section className="auth-card">
        <div className="auth-logo">🪷</div>

        <p className="auth-eyebrow">
          {isRegister
            ? "JOIN OUR COMMUNITY"
            : role === "ADMIN"
              ? "AUTHORISED ACCESS"
              : "WELCOME TO PMC"}
        </p>

        <h1>
          {isRegister
            ? "Create account"
            : role === "ADMIN"
              ? "Admin Sign In"
              : "Welcome back"}
        </h1>

        <p className="auth-subtitle">
          {isRegister
            ? "Begin your journey of learning and reflection."
            : role === "ADMIN"
              ? "Sign in to manage the PMC platform."
              : "Continue your journey of learning and reflection."}
        </p>

        {!isRegister && (
          <div className="role-switch">
            <button
              type="button"
              className={role === "USER" ? "active" : ""}
              onClick={() => changeRole("USER")}
            >
              User
            </button>
            <button
              type="button"
              className={role === "ADMIN" ? "active" : ""}
              onClick={() => changeRole("ADMIN")}
            >
              Admin
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </label>

          <button className="auth-submit" type="submit">
            {isRegister ? "Create Account →" : "Sign In →"}
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        {role === "ADMIN" && !isRegister && (
          <p className="admin-notice">
            🔒 Admin access is restricted. Admin privileges must be
            assigned securely by the backend, not selected by users.
          </p>
        )}

        <p className="auth-footer">
          {isRegister ? "Already have an account?" : "New to PMC?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setRole("USER");
              setMessage("");
            }}
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
