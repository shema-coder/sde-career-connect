import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

type ApplicationStatus =
  | "Received"
  | "Under Review"
  | "Documents Required"
  | "In Progress"
  | "Accepted"
  | "Completed"
  | "Rejected";

type AdminApplication = {
  id: number;
  reference_code: string;
  institution: string;
  full_names: string;
  gender: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  index_number: string;
  national_id: string;
  email: string;
  phone: string;
  date_of_birth: string;
  trade_option: string;
  disability: string;
  disability_details: string | null;
  refugee: string;
  faculty1: string;
  faculty2: string | null;
  faculty3: string | null;
  status: string;
  public_message: string;
  private_notes: string | null;
  consent: boolean;
  created_at: string;
  updated_at: string;
};

const API_URL = "http://localhost:8000";

const statuses: ApplicationStatus[] = [
  "Received",
  "Under Review",
  "Documents Required",
  "In Progress",
  "Accepted",
  "Completed",
  "Rejected",
];

const statusMessages: Record<ApplicationStatus, string> = {
  Received:
    "Your application has been successfully received by SDE Career Connect.",
  "Under Review":
    "Your application is currently being reviewed by our support team.",
  "Documents Required":
    "Additional documents or information are required before we can continue.",
  "In Progress":
    "Your application is actively being processed by our support team.",
  Accepted:
    "Your application has been accepted. Our team will provide the next steps.",
  Completed:
    "Your application support request has been completed successfully.",
  Rejected:
    "Unfortunately, this application support request could not be processed.",
};

function statusClass(status: string) {
  return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

function institutionName(value: string) {
  if (value === "UR") return "University of Rwanda";
  if (value === "RP") return "Rwanda Polytechnic";
  if (value === "ALU") return "African Leadership University";
  return value;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [search, setSearch] = useState("");
  const [institution, setInstitution] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [editingStatus, setEditingStatus] =
    useState<ApplicationStatus>("Received");
  const [publicMessage, setPublicMessage] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");

  useEffect(() => {
    const authenticated = localStorage.getItem(
      "sde_admin_authenticated",
    );

    if (authenticated !== "true") {
      navigate("/admin");
      return;
    }

    async function loadApplications() {
      try {
        const response = await fetch(
          `${API_URL}/admin/applications`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const result = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            typeof result?.detail === "string"
              ? result.detail
              : "Unable to load applications.",
          );
        }

        setApplications(
          Array.isArray(result) ? result : [],
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load applications.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadApplications();
  }, [navigate]);

  useEffect(() => {
    if (!selected) return;

    setEditingStatus(
      statuses.includes(selected.status as ApplicationStatus)
        ? (selected.status as ApplicationStatus)
        : "Received",
    );
    setPublicMessage(selected.public_message || "");
    setPrivateNotes(selected.private_notes || "");
    setSaveMessage("");
  }, [selected]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.reference_code
          .toLowerCase()
          .includes(query) ||
        application.full_names
          .toLowerCase()
          .includes(query) ||
        application.email
          .toLowerCase()
          .includes(query) ||
        application.phone
          .toLowerCase()
          .includes(query);

      const matchesInstitution =
        institution === "All" ||
        application.institution === institution;

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesStatus
      );
    });
  }, [
    applications,
    search,
    institution,
    statusFilter,
  ]);

  const counts = useMemo(
    () => ({
      total: applications.length,
      received: applications.filter(
        (item) =>
          item.status === "Received" ||
          item.status === "Submitted",
      ).length,
      review: applications.filter(
        (item) => item.status === "Under Review",
      ).length,
      ur: applications.filter(
        (item) => item.institution === "UR",
      ).length,
      rp: applications.filter(
        (item) => item.institution === "RP",
      ).length,
      alu: applications.filter(
        (item) => item.institution === "ALU",
      ).length,
    }),
    [applications],
  );

  async function saveApplicationUpdate() {
    if (!selected) return;

    try {
      setSaving(true);
      setSaveMessage("");

      const response = await fetch(
        `${API_URL}/admin/applications/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: editingStatus,
            public_message: publicMessage,
            private_notes: privateNotes,
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "Unable to update this application.",
        );
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === selected.id ? result : item,
        ),
      );

      setSelected(result);
      setSaveMessage(
        "Application status and messages updated successfully.",
      );
    } catch (err) {
      setSaveMessage(
        err instanceof Error
          ? err.message
          : "Unable to save application changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  function applyStatus(status: ApplicationStatus) {
    setEditingStatus(status);

    if (
      !publicMessage.trim() ||
      publicMessage ===
        statusMessages[selected?.status as ApplicationStatus]
    ) {
      setPublicMessage(statusMessages[status]);
    }
  }

  function logout() {
    localStorage.removeItem("sde_admin_authenticated");
    navigate("/admin");
  }

  return (
    <main className="admin-dashboard admin-applications-page">
      <header className="applications-topbar">
        <div className="applications-brand">
          <div className="applications-brand-mark">
            SDE
          </div>

          <div>
            <span>SDE CAREER CONNECT</span>
            <strong>Student Support Administration</strong>
          </div>
        </div>

        <div className="applications-top-actions">
          <button
            type="button"
            onClick={() => navigate("/admin/news")}
          >
            ← Content Dashboard
          </button>

          <button
            type="button"
            className="applications-signout"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="applications-page-shell">
        <section className="applications-page-heading">
          <div>
            <span className="applications-eyebrow">
              APPLICATION SUPPORT
            </span>
            <h1>Student Applications</h1>
            <p>
              Review, process and update student
              application-support requests from one
              workspace.
            </p>
          </div>

          <div className="applications-live-indicator">
            <span />
            Live application records
          </div>
        </section>

        <section className="applications-kpis">
          <article className="application-kpi kpi-total">
            <div className="kpi-icon">▦</div>
            <div>
              <span>Total applications</span>
              <strong>{counts.total}</strong>
              <small>All submitted requests</small>
            </div>
          </article>

          <article className="application-kpi kpi-review">
            <div className="kpi-icon">◷</div>
            <div>
              <span>Needs attention</span>
              <strong>
                {counts.received + counts.review}
              </strong>
              <small>
                Received or under review
              </small>
            </div>
          </article>

          <article className="application-kpi kpi-ur">
            <div className="kpi-icon">UR</div>
            <div>
              <span>University of Rwanda</span>
              <strong>{counts.ur}</strong>
              <small>Applications</small>
            </div>
          </article>

          <article className="application-kpi kpi-other">
            <div className="kpi-icon">+</div>
            <div>
              <span>RP + ALU</span>
              <strong>
                {counts.rp + counts.alu}
              </strong>
              <small>
                {counts.rp} RP · {counts.alu} ALU
              </small>
            </div>
          </article>
        </section>

        <section className="applications-workspace">
          <div className="applications-list-panel">
            <div className="applications-list-heading">
              <div>
                <span className="applications-eyebrow">
                  APPLICATION RECORDS
                </span>
                <h2>Student applications</h2>
              </div>

              <strong>
                {filteredApplications.length}
              </strong>
            </div>

            <div className="applications-toolbar">
              <div className="applications-search">
                <span>⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name, reference, email or phone"
                />
              </div>

              <select
                value={institution}
                onChange={(event) =>
                  setInstitution(event.target.value)
                }
              >
                <option value="All">
                  All institutions
                </option>
                <option value="UR">
                  University of Rwanda
                </option>
                <option value="RP">
                  Rwanda Polytechnic
                </option>
                <option value="ALU">
                  African Leadership University
                </option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All statuses</option>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="Submitted">Submitted</option>
              </select>
            </div>

            {loading && (
              <div className="applications-state">
                <div className="applications-loader" />
                <strong>Loading applications</strong>
                <span>
                  Fetching the latest student requests...
                </span>
              </div>
            )}

            {error && (
              <div className="applications-state applications-state-error">
                <strong>Unable to load applications</strong>
                <span>{error}</span>
              </div>
            )}

            {!loading &&
              !error &&
              filteredApplications.length === 0 && (
                <div className="applications-state">
                  <strong>No applications found</strong>
                  <span>
                    Try changing your search or filters.
                  </span>
                </div>
              )}

            {!loading &&
              !error &&
              filteredApplications.length > 0 && (
                <div className="applications-records">
                  <div className="applications-record-header">
                    <span>APPLICATION</span>
                    <span>INSTITUTION</span>
                    <span>STATUS</span>
                    <span>UPDATED</span>
                    <span />
                  </div>

                  {filteredApplications.map(
                    (application) => (
                      <button
                        type="button"
                        className={`application-record ${
                          selected?.id === application.id
                            ? "is-selected"
                            : ""
                        }`}
                        key={application.id}
                        onClick={() =>
                          setSelected(application)
                        }
                      >
                        <div className="record-student">
                          <div className="record-avatar">
                            {application.full_names
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {application.full_names}
                            </strong>
                            <span>
                              {application.reference_code}
                            </span>
                            <small>
                              {application.email} ·{" "}
                              {application.phone}
                            </small>
                          </div>
                        </div>

                        <div className="record-institution">
                          <strong>
                            {application.institution}
                          </strong>
                          <span>
                            {institutionName(
                              application.institution,
                            )}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`application-status-badge ${statusClass(
                              application.status ===
                                "Submitted"
                                ? "Received"
                                : application.status,
                            )}`}
                          >
                            <i />
                            {application.status ===
                            "Submitted"
                              ? "Received"
                              : application.status}
                          </span>
                        </div>

                        <div className="record-date">
                          {formatDate(
                            application.updated_at,
                          )}
                        </div>

                        <div className="record-arrow">
                          →
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}
          </div>

          <aside className="applications-side-panel">
            {selected ? (
              <>
                <div className="application-detail-header">
                  <div>
                    <span className="applications-eyebrow">
                      APPLICATION
                    </span>
                    <h2>
                      {selected.reference_code}
                    </h2>
                    <strong>
                      {selected.full_names}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="application-close"
                    onClick={() => setSelected(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="application-detail-summary">
                  <div>
                    <span>Institution</span>
                    <strong>
                      {institutionName(
                        selected.institution,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Current status</span>
                    <span
                      className={`application-status-badge ${statusClass(
                        selected.status ===
                          "Submitted"
                          ? "Received"
                          : selected.status,
                      )}`}
                    >
                      <i />
                      {selected.status === "Submitted"
                        ? "Received"
                        : selected.status}
                    </span>
                  </div>
                </div>

                <div className="application-detail-scroll">
                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      UPDATE STATUS
                    </span>

                    <div className="status-quick-grid">
                      {statuses.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className={
                            editingStatus === item
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            applyStatus(item)
                          }
                        >
                          <span>
                            {editingStatus === item
                              ? "✓"
                              : "○"}
                          </span>
                          {item}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      PUBLIC MESSAGE
                    </span>

                    <textarea
                      value={publicMessage}
                      onChange={(event) =>
                        setPublicMessage(
                          event.target.value,
                        )
                      }
                      rows={5}
                      placeholder="Message the student will see when tracking their application..."
                    />

                    <small className="application-helper">
                      This message is visible to the
                      student.
                    </small>
                  </section>

                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      PRIVATE ADMIN NOTES
                    </span>

                    <textarea
                      value={privateNotes}
                      onChange={(event) =>
                        setPrivateNotes(
                          event.target.value,
                        )
                      }
                      rows={4}
                      placeholder="Internal notes for SDE Career Connect staff..."
                    />

                    <small className="application-helper">
                      Students cannot see private notes.
                    </small>
                  </section>

                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      STUDENT INFORMATION
                    </span>

                    <div className="application-info-grid">
                      <div>
                        <span>Email</span>
                        <strong>
                          {selected.email}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>
                          {selected.phone}
                        </strong>
                      </div>

                      <div>
                        <span>Gender</span>
                        <strong>
                          {selected.gender}
                        </strong>
                      </div>

                      <div>
                        <span>Date of birth</span>
                        <strong>
                          {selected.date_of_birth}
                        </strong>
                      </div>

                      <div>
                        <span>Index number</span>
                        <strong>
                          {selected.index_number}
                        </strong>
                      </div>

                      <div>
                        <span>National ID</span>
                        <strong>
                          {selected.national_id}
                        </strong>
                      </div>
                    </div>
                  </section>

                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      LOCATION
                    </span>

                    <div className="application-location">
                      <strong>
                        {selected.province}
                      </strong>
                      <span>
                        {selected.district} ·{" "}
                        {selected.sector}
                      </span>
                      <span>
                        {selected.cell} ·{" "}
                        {selected.village}
                      </span>
                    </div>
                  </section>

                  <section className="application-detail-section">
                    <span className="applications-section-label">
                      APPLICATION DETAILS
                    </span>

                    <div className="application-info-grid">
                      <div>
                        <span>Trade / Option</span>
                        <strong>
                          {selected.trade_option}
                        </strong>
                      </div>

                      <div>
                        <span>Disability</span>
                        <strong>
                          {selected.disability}
                        </strong>
                      </div>

                      <div>
                        <span>Refugee status</span>
                        <strong>
                          {selected.refugee}
                        </strong>
                      </div>

                      <div>
                        <span>Submitted</span>
                        <strong>
                          {formatDate(
                            selected.created_at,
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="programme-choice-box">
                      <span>Programme choices</span>
                      <strong>
                        {selected.faculty1}
                      </strong>

                      {selected.faculty2 && (
                        <strong>
                          {selected.faculty2}
                        </strong>
                      )}

                      {selected.faculty3 && (
                        <strong>
                          {selected.faculty3}
                        </strong>
                      )}
                    </div>
                  </section>
                </div>

                <div className="application-detail-footer">
                  {saveMessage && (
                    <span
                      className={
                        saveMessage.includes(
                          "successfully",
                        )
                          ? "save-success"
                          : "save-error"
                      }
                    >
                      {saveMessage}
                    </span>
                  )}

                  <button
                    type="button"
                    className="application-save-button"
                    onClick={() =>
                      void saveApplicationUpdate()
                    }
                    disabled={saving}
                  >
                    {saving
                      ? "Saving changes..."
                      : "Save Application Update"}
                  </button>
                </div>
              </>
            ) : (
              <div className="application-empty-detail">
                <div>⌁</div>
                <h3>Select an application</h3>
                <p>
                  Choose a student application from the
                  records to review details and update
                  their status.
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
