import { useState } from "react";
import type { FormEvent } from "react";
import { apiRequest } from "../lib/api";

type MemberRegistrationProps = {
  onClose: () => void;
  onRegistered: () => void;
};

const educationOptions = [
  "S6 Graduate",
  "University Student",
  "Graduate",
  "Other",
];

const interestOptions = [
  "Scholarships",
  "University Admissions",
  "Career Opportunities",
  "General Opportunities",
];

export default function MemberRegistration({
  onClose,
  onRegistered,
}: MemberRegistrationProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiRequest("/members", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email: email || null,
          education_level: educationLevel,
          interest,
        }),
      });

      setSuccess(true);
      onRegistered();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.replace(/^API request failed:\s*\d+\s*/, "")
          : "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="member-modal-backdrop" onClick={onClose}>
      <section
        className="member-registration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-registration-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="member-modal-close"
          onClick={onClose}
          aria-label="Close registration"
        >
          ✕
        </button>

        {!success ? (
          <>
            <div className="member-modal-header">
              <span className="member-modal-icon">🎓</span>
              <div>
                <span className="section-kicker">SDE COMMUNITY</span>
                <h2 id="member-registration-title">
                  Join SDE Career Connect
                </h2>
                <p>
                  Register once and stay connected to scholarships,
                  admissions, careers and opportunities.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="member-registration-form">
              <label>
                Full Name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </label>

              <label>
                Phone / WhatsApp Number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+250 7XX XXX XXX"
                  required
                  autoComplete="tel"
                />
              </label>

              <label>
                Email <span>(optional)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </label>

              <label>
                Education Level
                <select
                  value={educationLevel}
                  onChange={(event) => setEducationLevel(event.target.value)}
                  required
                >
                  <option value="">Select your education level</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Main Interest
                <select
                  value={interest}
                  onChange={(event) => setInterest(event.target.value)}
                  required
                >
                  <option value="">What interests you most?</option>
                  {interestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <div className="member-form-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="button button-yellow member-submit-button"
                disabled={submitting}
              >
                {submitting ? "Registering..." : "Register Now →"}
              </button>

              <small className="member-form-note">
                Your personal information is kept private and is not
                displayed publicly.
              </small>
            </form>
          </>
        ) : (
          <div className="member-success-state">
            <div className="member-success-icon">✓</div>
            <span className="section-kicker">REGISTRATION COMPLETE</span>
            <h2>Welcome to SDE Career Connect!</h2>
            <p>
              You are now part of our student opportunity community.
              Stay connected for scholarships, admissions, careers and
              other opportunities.
            </p>

            <button
              type="button"
              className="button button-yellow"
              onClick={onClose}
            >
              Continue to Website →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
