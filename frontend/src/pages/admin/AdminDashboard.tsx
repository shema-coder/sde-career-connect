import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import "./Admin.css";

type MemberStats = {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    today: 0,
    this_week: 0,
    this_month: 0,
  });

  useEffect(() => {
    const authenticated = localStorage.getItem("sde_admin_authenticated");

    if (authenticated !== "true") {
      navigate("/admin");
      return;
    }

    apiRequest<MemberStats>("/admin/members/stats")
      .then(setStats)
      .catch(() => {
        // Keep dashboard usable even if statistics are temporarily unavailable.
      });
  }, [navigate]);

  function logout() {
    localStorage.removeItem("sde_admin_authenticated");
    navigate("/admin");
  }

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-brand">
            <img
              src="/assets/sde-logo-updated.png"
              alt="SDE Career Connect"
              className="admin-dashboard-logo"
            />

            <div>
              <span className="admin-kicker">SDE CAREER CONNECT</span>
              <h1>Administration Dashboard</h1>
              <p>
                Manage your student community, opportunities, applications and
                platform content.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="admin-back-button"
            onClick={logout}
          >
            Sign out
          </button>
        </header>

        <section className="admin-dashboard-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-label">REGISTERED MEMBERS</span>
            <strong>{stats.total.toLocaleString()}</strong>
            <span>Students and graduates</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">NEW TODAY</span>
            <strong>{stats.today.toLocaleString()}</strong>
            <span>Registrations today</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">THIS WEEK</span>
            <strong>{stats.this_week.toLocaleString()}</strong>
            <span>Registrations this week</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-label">THIS MONTH</span>
            <strong>{stats.this_month.toLocaleString()}</strong>
            <span>Registrations this month</span>
          </div>
        </section>

        <section className="admin-dashboard-section">
          <div className="admin-section-heading">
            <span className="admin-kicker">CONTROL CENTER</span>
            <h2>What would you like to manage?</h2>
            <p>
              Choose an area below to manage the SDE Career Connect platform.
            </p>
          </div>

          <div className="admin-dashboard-grid">
            <button
              type="button"
              className="admin-dashboard-card"
              onClick={() => navigate("/admin/news")}
            >
              <span className="admin-card-icon">📰</span>
              <span className="admin-card-content">
                <strong>News & Opportunities</strong>
                <span>
                  Create, publish and manage scholarships, admissions, careers
                  and announcements.
                </span>
              </span>
              <span className="admin-card-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-dashboard-card admin-dashboard-card-featured"
              onClick={() => navigate("/admin/members")}
            >
              <span className="admin-card-icon">👥</span>
              <span className="admin-card-content">
                <strong>Members</strong>
                <span>
                  View registered students, search members, filter records and
                  manage the community.
                </span>
              </span>
              <span className="admin-card-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-dashboard-card"
              onClick={() => navigate("/admin/applications")}
            >
              <span className="admin-card-icon">📋</span>
              <span className="admin-card-content">
                <strong>Applications</strong>
                <span>
                  Review and manage student application-support requests.
                </span>
              </span>
              <span className="admin-card-arrow">→</span>
            </button>
          </div>
        </section>

        <footer className="admin-dashboard-footer">
          <span>Powered by STOREROOM DIGITAL EMPIRE</span>
          <button type="button" onClick={() => navigate("/")}>
            ← Back to Website
          </button>
        </footer>
      </div>
    </main>
  );
}
