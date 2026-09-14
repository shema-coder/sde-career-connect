import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

type Member = {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  education_level: string;
  interest: string;
  created_at: string;
};

type MemberStats = {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
};

export default function AdminMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    today: 0,
    this_week: 0,
    this_month: 0,
  });

  const [search, setSearch] = useState("");
  const [education, setEducation] = useState("All");
  const [interest, setInterest] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("sde_admin_authenticated") !== "true") {
      navigate("/admin");
      return;
    }

    void loadData();
  }, [navigate]);

  async function loadData() {
    setLoading(true);

    try {
      const [memberData, statsData] = await Promise.all([
        apiRequest<Member[]>("/admin/members"),
        apiRequest<MemberStats>("/admin/members/stats"),
      ]);

      setMembers(memberData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMember(member: Member) {
    const confirmed = window.confirm(
      `Delete ${member.full_name} from SDE Career Connect members?`,
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/admin/members/${member.id}`, {
        method: "DELETE",
      });

      await loadData();
    } catch (error) {
      console.error("Failed to delete member:", error);
      window.alert("Could not delete this member.");
    }
  }

  function logout() {
    localStorage.removeItem("sde_admin_authenticated");
    navigate("/admin");
  }

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.full_name.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        (member.email || "").toLowerCase().includes(query);

      const matchesEducation =
        education === "All" ||
        member.education_level === education;

      const matchesInterest =
        interest === "All" ||
        member.interest === interest;

      return matchesSearch && matchesEducation && matchesInterest;
    });
  }, [members, search, education, interest]);

  return (
    <div className="admin-members-page">
      <header className="admin-members-header">
        <div>
          <span className="admin-kicker">SDE CAREER CONNECT</span>
          <h1>Member Management</h1>
          <p>Manage your registered student community.</p>
        </div>

        <div className="admin-members-header-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            className="admin-danger-button"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="admin-members-container">
        <section className="member-stat-grid">
          <div className="member-stat-card">
            <span>Total Members</span>
            <strong>{stats.total.toLocaleString()}</strong>
            <small>All registrations</small>
          </div>

          <div className="member-stat-card">
            <span>Today</span>
            <strong>{stats.today.toLocaleString()}</strong>
            <small>New today</small>
          </div>

          <div className="member-stat-card">
            <span>This Week</span>
            <strong>{stats.this_week.toLocaleString()}</strong>
            <small>Monday to today</small>
          </div>

          <div className="member-stat-card">
            <span>This Month</span>
            <strong>{stats.this_month.toLocaleString()}</strong>
            <small>Current month</small>
          </div>
        </section>

        <section className="admin-members-panel">
          <div className="admin-members-panel-header">
            <div>
              <span className="admin-kicker">MEMBER DATABASE</span>
              <h2>Registered Members</h2>
            </div>

            <span className="member-result-count">
              {filteredMembers.length} shown
            </span>
          </div>

          <div className="member-filters">
            <input
              type="search"
              placeholder="Search name, phone or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={education}
              onChange={(event) => setEducation(event.target.value)}
            >
              <option value="All">All Education Levels</option>
              <option value="S6 Graduate">S6 Graduate</option>
              <option value="University Student">
                University Student
              </option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={interest}
              onChange={(event) => setInterest(event.target.value)}
            >
              <option value="All">All Interests</option>
              <option value="Scholarships">Scholarships</option>
              <option value="University Admissions">
                University Admissions
              </option>
              <option value="Career Opportunities">
                Career Opportunities
              </option>
              <option value="General Opportunities">
                General Opportunities
              </option>
            </select>
          </div>

          {loading ? (
            <div className="member-empty-state">
              Loading members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="member-empty-state">
              No members match your current filters.
            </div>
          ) : (
            <div className="member-table-wrap">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Contact</th>
                    <th>Education</th>
                    <th>Interest</th>
                    <th>Registered</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <strong>{member.full_name}</strong>
                        <small>Member #{member.id}</small>
                      </td>

                      <td>
                        <strong>{member.phone}</strong>
                        <small>{member.email || "No email"}</small>
                      </td>

                      <td>
                        <span className="member-pill">
                          {member.education_level}
                        </span>
                      </td>

                      <td>
                        <span className="member-interest">
                          {member.interest}
                        </span>
                      </td>

                      <td>
                        {new Date(member.created_at).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="member-delete-button"
                          onClick={() => void deleteMember(member)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
