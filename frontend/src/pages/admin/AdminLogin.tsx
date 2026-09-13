import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    // Temporary prototype login.
    // Real authentication will be connected to FastAPI later.
    if (
      email.trim().toLowerCase() === "admin@sdecareerconnect.com" &&
      password === "SDEAdmin123!"
    ) {
      localStorage.setItem("sde_admin_authenticated", "true");
      navigate("/admin/news");
      return;
    }

    setError("Invalid administrator email or password.");
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-card">
        <img
          src="/assets/sde-logo-updated.png"
          alt="SDE Career Connect"
          className="admin-auth-logo"
        />

        <span className="admin-kicker">PRIVATE ADMIN AREA</span>

        <h1>Administrator Login</h1>

        <p>
          Sign in to manage SDE Career Connect news, announcements, and
          educational opportunities.
        </p>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label htmlFor="admin-email">Administrator email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter administrator email"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-primary-button">
            Sign in to Dashboard
          </button>
        </form>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}
