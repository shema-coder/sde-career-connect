import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  HEC_2026_2027_NOTICE,
  institutionSupportInfo,
} from "../data/institutionSupport";
import "./ApplicationSupport.css";

type Institution =
  | "UR"
  | "RP"
  | "ALU"
  | "UOK"
  | "AUCA"
  | "ULK"
  | "UTAB"
  | "ICK"
  | "INES"
  | "MKU"
  | "UTB"
  | "CUR"
  | "KEPLER"
  | "RICA"
  | "PIASS";

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  file: File;
};

type ApplicationData = {
  institution: Institution | "";
  fullNames: string;
  gender: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  indexNumber: string;
  nationalId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  tradeOption: string;
  disability: string;
  disabilityDetails: string;
  passportPhoto: UploadedFile | null;
  refugee: string;
  faculty1: string;
  faculty2: string;
  faculty3: string;
  nationalIdPhoto: UploadedFile | null;
  resultSlip: UploadedFile | null;
  consent: boolean;
};

const STORAGE_KEY = "sde-career-connect-application-support-v2";

const initialData: ApplicationData = {
  institution: "",
  fullNames: "",
  gender: "",
  province: "",
  district: "",
  sector: "",
  cell: "",
  village: "",
  indexNumber: "",
  nationalId: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  tradeOption: "",
  disability: "",
  disabilityDetails: "",
  passportPhoto: null,
  refugee: "",
  faculty1: "",
  faculty2: "",
  faculty3: "",
  nationalIdPhoto: null,
  resultSlip: null,
  consent: false,
};

const institutionInfo: Partial<Record<
  Institution,
  {
    name: string;
    short: string;
    description: string;
    logo: string;
    requirements: string[];
    scholarship?: string[];
  }
>> = {
  UR: {
    name: "University of Rwanda",
    short: "UR",
    description: "University admission guidance and programme selection.",
    logo: "/assets/universities/ur-logo.png",
    requirements: [
      "Completed Senior 6, TVET or an accepted equivalent qualification.",
      "At least two relevant principal passes for higher-education entry.",
      "Programme-specific subject combinations and cut-off requirements may apply.",
      "Valid identification and academic documents are required.",
      "Applicants should follow the official UR application and payment process.",
    ],
  },
  RP: {
    name: "Rwanda Polytechnic",
    short: "RP",
    description: "Technical, vocational and applied higher-education guidance.",
    logo: "/assets/universities/rp-logo.jpeg",
    requirements: [
      "Completed Senior 6 or an accepted Level 5 TVET qualification.",
      "At least two relevant principal passes may be required.",
      "Programme-specific subjects and requirements apply.",
      "National ID or passport and valid contact information are required.",
      "Advanced Diploma applicants for some BTech routes may use relevant academic records.",
    ],
  },
  ALU: {
    name: "African Leadership University",
    short: "ALU",
    description: "Admission, programme and scholarship guidance.",
    logo: "/assets/universities/alu-logo.webp",
    requirements: [
      "Accepted secondary-school qualification or equivalent.",
      "Academic requirements depend on the programme selected.",
      "Academic records and other required supporting documents must be provided.",
      "English proficiency may be required for admission.",
      "Additional programme-specific requirements can apply.",
    ],
    scholarship: [
      "Financial need may be considered for financial-aid opportunities.",
      "Academic strength and admission eligibility are important.",
      "Some scholarships consider leadership, initiative and community impact.",
      "Scholarship requirements vary by the specific opportunity.",
      "Additional financial or supporting documents may be requested.",
    ],


},

  UOK: {
    name: "University of Kigali",
    short: "UoK",
    description: "University admission support, programme guidance and application preparation.",
    logo: "/assets/universities/uok-logo.webp",
    requirements: [],
  },

  AUCA: {
    name: "Adventist University of Central Africa",
    short: "AUCA",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/auca-logo.webp",
    requirements: [],
  },

  ULK: {
    name: "University of Lay Adventists of Kigali",
    short: "ULK",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/ulk-logo.webp",
    requirements: [],
  },

  UTAB: {
    name: "University of Technology and Arts of Byumba",
    short: "UTAB",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/utab-logo.png",
    requirements: [],
  },

  ICK: {
    name: "Institut Catholique de Kabgayi",
    short: "ICK",
    description: "Admission guidance, programme selection and application support.",
    logo: "/assets/universities/ick-logo.webp",
    requirements: [],
  },

  INES: {
    name: "INES-Ruhengeri",
    short: "INES",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/ines-logo.webp",
    requirements: [],
  },

  MKU: {
    name: "Mount Kigali University",
    short: "MKU",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/mku-logo.webp",
    requirements: [],
  },

  UTB: {
    name: "University of Tourism, Technology and Business Studies",
    short: "UTB",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/utb-logo.png",
    requirements: [],
  },

  CUR: {
    name: "Catholic University of Rwanda",
    short: "CUR",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/cur-logo.webp",
    requirements: [],
  },

  KEPLER: {
    name: "Kepler College",
    short: "KEPLER",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/kepler-logo.webp",
    requirements: [],
  },

  RICA: {
    name: "Rwanda Institute for Conservation Agriculture",
    short: "RICA",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/rica-logo.webp",
    requirements: [],
  },

  PIASS: {
    name: "Protestant Institute of Arts and Social Sciences",
    short: "PIASS",
    description: "Admission guidance, programme selection and application preparation.",
    logo: "/assets/universities/piass-logo.jpeg",
    requirements: [],
  },
  };

const steps = [
  { number: 1, title: "Institution", label: "Choose where you want to apply" },
  { number: 2, title: "Information", label: "Tell us about yourself" },
  { number: 3, title: "Documents", label: "Upload your documents" },
  { number: 4, title: "Choices", label: "Tell us what you want to study" },
  { number: 5, title: "Review", label: "Check everything before sending" },
];

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const maskValue = (value: string) => {
  if (!value) return "—";
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
};

type ApplicationSupportProps = {
  onClose: () => void;
  initialView?: "form" | "tracking";
  initialURChoices?: [string, string, string] | null;
};

const APPLICATION_API_URL =
  import.meta.env.VITE_API_URL || "https://sde-career-connect.onrender.com";

const ApplicationSupport: React.FC<ApplicationSupportProps> = ({
  onClose,
  initialView = "form",
  initialURChoices = null,
}) => {
  const [data, setData] = useState<ApplicationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return initialData;
      const parsed = JSON.parse(saved);
      return {
        ...initialData,
        ...parsed,
        passportPhoto: null,
        nationalIdPhoto: null,
        resultSlip: null,
      };
    } catch {
      return initialData;
    }
  });

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [trackingPin, setTrackingPin] = useState("");

  const [trackingView, setTrackingView] = useState(
    initialView === "tracking"
  );
  const [trackingReference, setTrackingReference] = useState("");
  const [trackingPinInput, setTrackingPinInput] = useState("");
  const [showTrackingPin, setShowTrackingPin] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [trackingResult, setTrackingResult] = useState<{
    reference_code: string;
    institution: string;
    status: string;
    public_message: string;
    created_at: string;
    updated_at: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const safeData = {
      ...data,
      passportPhoto: null,
      nationalIdPhoto: null,
      resultSlip: null,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  }, [data]);

  useEffect(() => {
    if (!initialURChoices || !initialURChoices.some(Boolean)) {
      return;
    }

    setData((current) => ({
      ...current,
      institution: "UR",
      faculty1: initialURChoices[0] || "",
      faculty2: initialURChoices[1] || "",
      faculty3: initialURChoices[2] || "",
    }));

    setStep((current) => Math.max(current, 1));
  }, [initialURChoices]);

  useEffect(() => {
    document.body.classList.add("application-support-open");

    return () => {
      document.body.classList.remove("application-support-open");
    };
  }, []);

  const selectedInstitution = data.institution
    ? institutionInfo[data.institution]
    : null;

  const selectedSupportInfo = data.institution
    ? institutionSupportInfo[data.institution as keyof typeof institutionSupportInfo] ?? null
    : null;

  const [activeSupportPanel, setActiveSupportPanel] = useState<
    "eligibility" | "programmes" | "documents" | "funding" | "important" | "support"
  >("eligibility");

  const readinessChecks = [
    {
      label: "Personal details",
      done: Boolean(
        data.fullNames.trim() &&
        data.gender &&
        data.dateOfBirth,
      ),
    },
    {
      label: "Contact & location",
      done: Boolean(
        data.email.trim() &&
        data.phone.trim() &&
        data.province &&
        data.district &&
        data.sector &&
        data.cell &&
        data.village,
      ),
    },
    {
      label: "Academic information",
      done: Boolean(
        data.indexNumber.trim() ||
        data.tradeOption.trim(),
      ),
    },
    {
      label: "Programme choices",
      done: Boolean(
        data.faculty1.trim() &&
        data.faculty2.trim() &&
        data.faculty3.trim(),
      ),
    },
    {
      label: "Support information",
      done: Boolean(
        data.disability &&
        data.refugee,
      ),
    },
  ];

  const readinessPercent = Math.round(
    (readinessChecks.filter((item) => item.done).length /
      readinessChecks.length) *
      100,
  );

  const verificationLabel =
    selectedSupportInfo?.verificationStatus === "VERIFIED_OFFICIAL"
      ? "VERIFIED OFFICIAL"
      : selectedSupportInfo?.verificationStatus ===
          "VERIFIED_WITH_PROGRAMME_CHECK"
        ? "VERIFIED + PROGRAMME CHECK"
        : "GENERAL GUIDANCE";


  const completion = Math.round((step / steps.length) * 100);

  const update = <K extends keyof ApplicationData>(
    field: K,
    value: ApplicationData[K]
  ) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const handleFile = (
    field: "passportPhoto" | "nationalIdPhoto" | "resultSlip",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";

    const isPdf = file.type === "application/pdf";

    if (field !== "resultSlip" && !isImage) {
      setErrors((current) => ({
        ...current,
        [field]: "Please upload a JPG, PNG or WEBP image.",
      }));
      event.target.value = "";
      return;
    }

    if (field === "resultSlip" && !isImage && !isPdf) {
      setErrors((current) => ({
        ...current,
        [field]: "Please upload an image or PDF document.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        [field]: "Maximum file size is 8 MB.",
      }));
      event.target.value = "";
      return;
    }

    update(field, {
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    });
  };

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1 && !data.institution) {
      nextErrors.institution = "Please select an institution.";
    }

    if (step === 2) {
      if (!data.fullNames.trim()) nextErrors.fullNames = "Full names are required.";
      if (!data.gender) nextErrors.gender = "Please select your gender.";
      if (!data.province.trim()) nextErrors.province = "Province is required.";
      if (!data.district.trim()) nextErrors.district = "District is required.";
      if (!data.sector.trim()) nextErrors.sector = "Sector is required.";
      if (!data.cell.trim()) nextErrors.cell = "Cell is required.";
      if (!data.village.trim()) nextErrors.village = "Village is required.";
      if (!data.email.trim()) nextErrors.email = "Email is required.";
      if (!data.phone.trim()) nextErrors.phone = "Phone number is required.";
      if (!data.dateOfBirth) nextErrors.dateOfBirth = "Date of birth is required.";
      if (!data.disability) nextErrors.disability = "Please select an option.";

      if (
        data.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
      ) {
        nextErrors.email = "Please enter a valid email address.";
      }
    }

    if (step === 3) {
      if (!data.passportPhoto) {
        nextErrors.passportPhoto = "Passport photo is required.";
      }

      if (!data.nationalIdPhoto) {
        nextErrors.nationalIdPhoto = "National ID photo is required.";
      }

      if (!data.resultSlip) {
        nextErrors.resultSlip = "Result slip / diploma is required.";
      }
    }

    if (step === 4) {
      if (!data.refugee) nextErrors.refugee = "Please select an option.";
      if (!data.faculty1.trim()) nextErrors.faculty1 = "First choice is required.";
      if (!data.faculty2.trim()) nextErrors.faculty2 = "Second choice is required.";
      if (!data.faculty3.trim()) nextErrors.faculty3 = "Third choice is required.";
    }

    if (step === 5 && !data.consent) {
      nextErrors.consent = "Please confirm that the information is accurate.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length));
  };

  const previousStep = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
  };

  const submit = async () => {
    console.log("[SDE Application] Submit clicked", {
      saving,
      consent: data.consent,
      institution: data.institution,
    });

    if (saving) return;

    if (!data.consent) {
      setErrors({
        consent:
          "Please confirm that the information is accurate before submitting.",
      });
      return;
    }

    if (!data.institution) {
      setErrors({
        institution: "Please select an institution.",
      });
      setStep(1);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const payload = {
        institution: data.institution,
        full_names: data.fullNames,
        gender: data.gender,
        province: data.province,
        district: data.district,
        sector: data.sector,
        cell: data.cell,
        village: data.village,
        index_number: data.indexNumber,
        national_id: data.nationalId,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        trade_option: data.tradeOption,
        disability: data.disability,
        disability_details: data.disabilityDetails || "",
        refugee: data.refugee,
        faculty1: data.faculty1,
        faculty2: data.faculty2,
        faculty3: data.faculty3,
        consent: data.consent,
      };

      const apiBaseUrl = (
        APPLICATION_API_URL
      ).replace(/\/+$/, "");

      const response = await fetch(`${apiBaseUrl}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result: {
        detail?:
          | string
          | Array<{
              type?: string;
              loc?: Array<string | number>;
              msg?: string;
            }>;
        reference_code?: string;
        tracking_pin?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        let message = `Application submission failed (${response.status}).`;

        if (typeof result.detail === "string") {
          message = result.detail;
        } else if (Array.isArray(result.detail)) {
          message = result.detail
            .map((item) => {
              const location = item.loc?.filter(
                (part) => part !== "body",
              );

              const field = location?.length
                ? String(location[location.length - 1]).replace(/_/g, " ")
                : "application";

              return `${field}: ${item.msg || "Invalid value"}`;
            })
            .join(" • ");
        }

        throw new Error(message);
      }

      if (!result.reference_code || !result.tracking_pin) {
        throw new Error(
          "The server did not return a reference code and tracking PIN."
        );
      }

      console.log("[SDE Application] Backend submission successful:", result);

      setRequestId(result.reference_code);
      setTrackingPin(result.tracking_pin);

      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (error) {
      console.error("[SDE Application] Submission failed:", error);

      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const institutionLogo = useMemo(() => {
    if (!selectedInstitution) return null;
    return selectedInstitution.logo;
  }, [selectedInstitution]);

  const trackApplication = async () => {
    const reference = trackingReference.trim();
    const pin = trackingPinInput.trim();

    setTrackingError("");
    setTrackingResult(null);

    if (!reference) {
      setTrackingError("Please enter your reference code.");
      return;
    }

    if (!pin) {
      setTrackingError("Please enter your private tracking PIN.");
      return;
    }

    setTrackingLoading(true);

    try {
      const response = await fetch(
        `${APPLICATION_API_URL}/applications/track?reference_code=${encodeURIComponent(
          reference
        )}&tracking_pin=${encodeURIComponent(pin)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "We could not find an application with those tracking details."
        );
      }

      setTrackingResult(result);
    } catch (error) {
      setTrackingError(
        error instanceof Error
          ? error.message
          : "Unable to check the application status. Please try again."
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  if (trackingView) {
    return (
      <div className="application-shell application-tracking">
        <div className="tracking-shell">
          <button
            type="button"
            className="tracking-back"
            onClick={() => {
              setTrackingView(false);
              setTrackingError("");
              setTrackingResult(null);
            }}
          >
            ← Back
          </button>

          <header className="tracking-header">
            <span className="tracking-kicker">SDE Career Connect</span>
            <h1>Track your application</h1>
            <p>
              Use the reference code and private tracking PIN you received
              after submitting your application support request.
            </p>
          </header>

          <section className="tracking-form-card">
            <div className="tracking-fields">
              <div className="tracking-field">
                <label htmlFor="tracking-reference">
                  Reference Code
                </label>

                <div className="tracking-input-wrap">
                  <input
                    id="tracking-reference"
                    type="text"
                    value={trackingReference}
                    onChange={(event) => {
                      setTrackingReference(event.target.value);
                      setTrackingError("");
                    }}
                    placeholder="SDE-AS-2026-477424"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="tracking-field">
                <label htmlFor="tracking-pin">
                  Private Tracking PIN
                </label>

                <div className="tracking-input-wrap">
                  <input
                    id="tracking-pin"
                    type={showTrackingPin ? "text" : "password"}
                    value={trackingPinInput}
                    onChange={(event) => {
                      setTrackingPinInput(event.target.value);
                      setTrackingError("");
                    }}
                    placeholder="Enter your PIN"
                    inputMode="numeric"
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    className="tracking-pin-toggle"
                    onClick={() => setShowTrackingPin((current) => !current)}
                  >
                    {showTrackingPin ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="tracking-submit"
              onClick={() => void trackApplication()}
              disabled={trackingLoading}
            >
              {trackingLoading ? "Checking application..." : "Check Application Status"}
            </button>

            {trackingError && (
              <div className="tracking-error" role="alert">
                {trackingError}
              </div>
            )}
          </section>

          {trackingResult && (
            <section className="tracking-result-card">
              <div className="tracking-result-top">
                <div>
                  <div className="tracking-reference">
                    {trackingResult.reference_code}
                  </div>

                  <h2>Application status</h2>
                </div>

                <div className="tracking-status-badge">
                  <span className="tracking-status-dot" />
                  {trackingResult.status}
                </div>
              </div>

              <div className="tracking-journey">
                <div className="tracking-journey-heading">
                  <div>
                    <span className="tracking-section-label">
                      APPLICATION JOURNEY
                    </span>
                    <h3>Follow your support request</h3>
                  </div>
                  <span className="tracking-journey-caption">
                    {trackingResult.status === "Rejected"
                      ? "This request has been closed."
                      : trackingResult.status === "Documents Required"
                        ? "Additional action may be required."
                        : "Your request is moving through the support process."}
                  </span>
                </div>

                <div className="tracking-steps">
                  {[
                    "Submitted",
                    "Received",
                    "Under Review",
                    "In Progress",
                    "Accepted",
                    "Completed",
                  ].map((statusLabel, index) => {
                    const order = [
                      "Submitted",
                      "Received",
                      "Under Review",
                      "Documents Required",
                      "In Progress",
                      "Accepted",
                      "Completed",
                    ];

                    const currentIndex = Math.max(
                      0,
                      order.indexOf(trackingResult.status),
                    );

                    const complete =
                      trackingResult.status !== "Rejected" &&
                      index < currentIndex;

                    const current =
                      trackingResult.status !== "Rejected" &&
                      index === currentIndex;

                    return (
                      <div
                        key={statusLabel}
                        className={`tracking-step ${
                          complete ? "is-complete" : ""
                        } ${current ? "is-current" : ""}`}
                      >
                        <div className="tracking-step-marker">
                          {complete ? "✓" : index + 1}
                        </div>

                        <div className="tracking-step-copy">
                          <strong>{statusLabel}</strong>
                          <span>
                            {complete
                              ? "Completed"
                              : current
                                ? "Current stage"
                                : "Upcoming"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {trackingResult.status === "Documents Required" && (
                  <div className="tracking-special-state tracking-documents-state">
                    <strong>Documents required</strong>
                    <span>
                      Contact SDE Career Connect for instructions about the
                      missing or additional documents.
                    </span>
                  </div>
                )}

                {trackingResult.status === "Rejected" && (
                  <div className="tracking-special-state tracking-rejected-state">
                    <strong>Support request rejected</strong>
                    <span>
                      Contact SDE Career Connect for clarification and next
                      available options.
                    </span>
                  </div>
                )}
              </div>

              <div className="tracking-message">
                {trackingResult.public_message}
              </div>

              <div className="tracking-meta">
                <div className="tracking-meta-item">
                  <span>Institution</span>
                  <strong>{trackingResult.institution}</strong>
                </div>

                <div className="tracking-meta-item">
                  <span>Submitted</span>
                  <strong>
                    {new Date(trackingResult.created_at).toLocaleString()}
                  </strong>
                </div>

                <div className="tracking-meta-item">
                  <span>Last updated</span>
                  <strong>
                    {new Date(trackingResult.updated_at).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="tracking-security-note">
                <span>🔒</span>
                <span>
                  Your tracking PIN is private. SDE Career Connect will never
                  display it as part of your public application status.
                </span>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="application-success-screen">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="sde-confetti"
            aria-hidden="true"
          />
        ))}

        <div className="application-success-shell">
          <button
            type="button"
            className="application-close success-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <div className="application-success-card">
            <div className="application-success-hero">
              <div className="application-success-brand">
                <div className="application-success-brand-mark">
                  <img
                    src="/assets/sde-logo.png"
                    alt="SDE Career Connect"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget
                        .nextElementSibling as HTMLElement | null;
                      fallback?.classList.add("is-visible");
                    }}
                  />
                  <span>SDE</span>
                </div>

                <div>
                  <strong>SDE CAREER CONNECT</strong>
                  <small>APPLICATION SUPPORT</small>
                </div>
              </div>

              <div className="application-success-check-wrap">
                <div className="application-success-check">
                  ✓
                </div>
              </div>

              <span className="application-success-section-kicker">
                REQUEST SUCCESSFULLY RECEIVED
              </span>

              <h1 className="application-success-title">
                Congratulations!
              </h1>

              <p className="application-success-subtitle">
                Your application support request is now with SDE Career Connect.
              </p>

              <p className="application-success-body">
                We have received your information and documents. Our team can
                now review your request and guide you according to the
                requirements of your selected institution.
              </p>
            </div>

            <section className="application-success-section">
              <div className="application-success-section-heading">
                <span className="application-success-section-kicker">
                  YOUR REQUEST
                </span>
                <h2>Your support details</h2>
                <p>
                  Save these details. You will need them whenever you want to
                  track or discuss your application support request.
                </p>
              </div>

              <div className="application-success-id-grid">
                <div className="application-success-id-card application-success-reference">
                  <div className="application-success-id-top">
                    <span className="application-success-id-label">
                      YOUR REFERENCE ID
                    </span>
                    <span className="application-success-id-status">
                      <i />
                      RECEIVED
                    </span>
                  </div>

                  <strong className="application-success-id-value">
                    {requestId}
                  </strong>

                  <button
                    type="button"
                    className="application-success-copy"
                    onClick={() => {
                      if (requestId && trackingPin) {
                        navigator.clipboard?.writeText(
                          `SDE Career Connect\nReference code: ${requestId}\nTracking PIN: ${trackingPin}`
                        );
                      }
                    }}
                  >
                    <span>Copy reference & PIN</span>
                    <span>⧉</span>
                  </button>
                </div>

                <div className="application-success-id-card application-success-pin">
                  <span className="application-success-id-label">
                    PRIVATE TRACKING PIN
                  </span>

                  <strong className="application-success-id-value">
                    {trackingPin}
                  </strong>

                  <p className="application-success-id-note">
                    Keep this PIN private. You need it to track your
                    application.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="application-success-primary"
                onClick={() => {
                  setTrackingReference(requestId);
                  setTrackingPinInput(trackingPin);
                  setTrackingError("");
                  setTrackingResult(null);
                  setTrackingView(true);
                }}
              >
                <span>✓</span>
                <strong>Track My Application</strong>
                <span>→</span>
              </button>
            </section>

            {selectedSupportInfo && (
              <section className="application-success-institution">
                <div className="application-success-institution-logo">
                  {institutionLogo ? (
                    <img
                      src={institutionLogo}
                      alt={selectedSupportInfo.name}
                    />
                  ) : (
                    <span>{selectedSupportInfo.shortName}</span>
                  )}
                </div>

                <div>
                  <span className="application-success-section-kicker">
                    SELECTED INSTITUTION
                  </span>
                  <h2>{selectedSupportInfo.name}</h2>
                  <p>
                    Your guidance will be aligned with the admission
                    requirements and application process of{" "}
                    {selectedSupportInfo.shortName}.
                  </p>
                </div>

                <div className="application-success-institution-badge">
                  ✓ Selected
                </div>
              </section>
            )}

            <section className="application-success-section">
              <div className="application-success-section-heading">
                <span className="application-success-section-kicker">
                  WHAT HAPPENS NEXT
                </span>
                <h2>Your application support journey</h2>
                <p>
                  We will help you move from preparation to the correct
                  official application process.
                </p>
              </div>

              <div className="application-success-journey">
                <article className="application-success-step">
                  <span className="application-success-step-number">
                    01
                  </span>
                  <div className="application-success-step-icon">✓</div>
                  <h3>Information review</h3>
                  <p>
                    SDE reviews the information and documents you provided.
                  </p>
                </article>

                <article className="application-success-step">
                  <span className="application-success-step-number">
                    02
                  </span>
                  <div className="application-success-step-icon">◎</div>
                  <h3>Institution guidance</h3>
                  <p>
                    You receive guidance based on your selected institution
                    and programme choices.
                  </p>
                </article>

                <article className="application-success-step">
                  <span className="application-success-step-number">
                    03
                  </span>
                  <div className="application-success-step-icon">↗</div>
                  <h3>Official application</h3>
                  <p>
                    We help you understand how to proceed through the
                    institution's official application channel.
                  </p>
                </article>
              </div>
            </section>

            <div className="application-success-important">
              <div className="application-success-important-icon">
                !
              </div>

              <div>
                <span className="application-success-section-kicker">
                  IMPORTANT
                </span>

                <h2>
                  SDE Career Connect is not the official university portal
                </h2>

                <p>
                  SDE Career Connect provides application guidance and
                  support. We are not the official application portal of the
                  selected university. Final admission decisions and official
                  applications are handled by the institution itself.
                </p>

                {selectedSupportInfo && (
                  <div className="application-success-important-note">
                    <strong>
                      Selected institution: {selectedSupportInfo.name}
                    </strong>
                    <span>
                      Requirements can vary by programme. Always follow the
                      latest official institutional instructions.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <section className="application-success-section application-success-support">
              <div>
                <span className="application-success-section-kicker">
                  NEED HELP?
                </span>

                <h2>Talk to SDE Support</h2>

                <p>
                  Contact our team if you need help understanding your next
                  application step.
                </p>
              </div>

              <button
                type="button"
                className="application-success-secondary"
                onClick={() => {
                  window.open(
                    "https://wa.me/250796371484?text=Hello%20SDE%20Career%20Connect%2C%20I%20have%20submitted%20an%20Application%20Support%20request.%20My%20request%20ID%20is%20" +
                      encodeURIComponent(requestId),
                    "_blank"
                  );
                }}
              >
                Talk to SDE Support
                <span>↗</span>
              </button>
            </section>

            <div className="application-success-footer">
              <button
                type="button"
                className="application-success-secondary"
                onClick={onClose}
              >
                ← Back to SDE Career Connect
              </button>

              <p>
                SDE Career Connect • Helping students make better education
                and career decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-shell">
      <div className="application-panel">
        <header className="application-header">
          <div className="application-brand">
            <div className="brand-mark">SDE</div>
            <div>
              <strong>SDE Career Connect</strong>
              <span>Application Support</span>
            </div>
          </div>

          <button className="application-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="application-progress">
          <div className="progress-top">
            <div>
              <span className="progress-eyebrow">
                STEP {step} OF {steps.length}
              </span>
              <h2>{steps[step - 1].title}</h2>
              <p>{steps[step - 1].label}</p>
            </div>

            <strong>{completion}%</strong>
          </div>

          <div className="progress-track">
            <div style={{ width: `${completion}%` }} />
          </div>

          <div className="step-indicators">
            {steps.map((item) => (
              <div
                key={item.number}
                className={`step-indicator ${
                  item.number === step
                    ? "active"
                    : item.number < step
                    ? "complete"
                    : ""
                }`}
              >
                <span>{item.number < step ? "✓" : item.number}</span>
                <small>{item.title}</small>
              </div>
            ))}
          </div>
        </div>

        <main className="application-content">
          {step === 1 && (
            <section className="form-step institution-step">

              <div className="institution-step-intro">
                <div className="institution-intro-copy">
                  <span className="section-tag">START HERE</span>

                  <h1>Where do you want to apply?</h1>

                  <p>
                    Select your institution. We will show you the important
                    admission information before you continue.
                  </p>
                </div>

                <div className="institution-intro-status">
                  <span className="institution-status-dot" />
                  <span>
                    {data.institution
                      ? "Institution selected"
                      : "Choose an institution"}
                  </span>
                </div>
              </div>

              <div className="institution-choice-grid">
                {(Object.keys(institutionInfo) as Institution[]).map((key) => {
                  const institution = institutionInfo[key];

                  if (!institution) return null;

                  const selected = data.institution === key;

                  return (
                    <button
                      type="button"
                      key={key}
                      className={`smart-institution-card ${
                        selected ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        update("institution", key);
                        setActiveSupportPanel("eligibility");
                        setErrors({});
                        setStep(2);
                      }}
                      aria-pressed={selected}
                    >
                      <div className="smart-institution-card-top">
                        <div className="smart-institution-logo">
                          {institution.logo ? (
                            <img
                              src={institution.logo}
                              alt={`${institution.name} logo`}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";

                                const fallback =
                                  event.currentTarget.parentElement?.querySelector(
                                    ".smart-logo-fallback"
                                  );

                                fallback?.classList.add("visible");
                              }}
                            />
                          ) : null}

                          <span className="smart-logo-fallback">
                            {institution.short}
                          </span>
                        </div>

                        <div className="smart-institution-badge">
                          {selected ? "SELECTED" : institution.short}
                        </div>
                      </div>

                      <div className="smart-institution-content">
                        <h3>{institution.name}</h3>
                        <p>{institution.description}</p>
                      </div>

                      <div className="smart-institution-footer">
                        <span className="smart-institution-action">
                          {selected
                            ? "ENTER UNIVERSITY"
                            : "ENTER UNIVERSITY"}
                        </span>

                        <span
                          className="smart-institution-arrow"
                          aria-hidden="true"
                        >
                          {selected ? "✓" : "→"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {data.institution &&
                (() => {
                  const selectedInstitutionInfo =
                    institutionInfo[data.institution];

                  if (!selectedInstitutionInfo) return null;

                  return (
                    <div className="mobile-institution-entry">
                      <div className="mobile-institution-entry-copy">
                        <span className="mobile-entry-kicker">
                          UNIVERSITY SELECTED
                        </span>
                        <strong>
                          {selectedInstitutionInfo.name}
                        </strong>
                        <span>
                          Ready to review admission guidance and start your
                          application support.
                        </span>
                      </div>

                      <button
                        type="button"
                        className="mobile-start-now-button"
                        onClick={() => {
                          setActiveSupportPanel("eligibility");
                          setErrors({});
                          setStep(2);
                        }}
                      >
                        START NOW <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  );
                })()}

              {errors.institution && (
                <p className="field-error institution-selection-error">
                  {errors.institution}
                </p>
              )}

<div
                className={`smart-next-card ${
                  data.institution ? "ready" : "not-ready"
                }`}
              >
                <div className="smart-next-selection">

                  <div className="smart-next-check">
                    {data.institution ? "✓" : "1"}
                  </div>

                  <div>
                    <span className="smart-next-eyebrow">
                      {data.institution
                        ? "YOUR SELECTION"
                        : "NEXT STEP"}
                    </span>

                    <h3>
                      {data.institution
                        ? selectedSupportInfo?.name
                        : "Choose an institution first"}
                    </h3>

                    <p>
                      {data.institution
                        ? `You selected ${selectedSupportInfo?.shortName}. Your application will be prepared for this institution.`
                        : "Select UR, RP or ALU above to continue with your application."}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="smart-next-button"
                  onClick={() => {
                    if (!data.institution) {
                      setErrors({
                        institution: "Please select an institution to continue.",
                      });
                      return;
                    }

                    setErrors({});
                    setStep(2);
                  }}
                  disabled={!data.institution}
                >
                  <span>Continue to personal information</span>
                  <span className="smart-next-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>

            </section>
          )}

              {step === 2 && selectedSupportInfo && (
                <section className="smart-admission-dashboard">

                  <div className="smart-dashboard-header">

                    <div className="smart-dashboard-identity">

                      <div className="smart-dashboard-logo">
                        {selectedInstitution?.logo ? (
                          <img
                            src={selectedInstitution.logo}
                            alt={`${selectedSupportInfo.name} logo`}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";

                              const fallback =
                                event.currentTarget.parentElement?.querySelector(
                                  ".smart-dashboard-logo-fallback",
                                );

                              fallback?.classList.add("visible");
                            }}
                          />
                        ) : null}

                        <span className="smart-dashboard-logo-fallback">
                          {selectedSupportInfo.shortName}
                        </span>
                      </div>

                      <div className="smart-dashboard-heading">

                        <div className="smart-dashboard-eyebrow">
                          {selectedSupportInfo.eyebrow}
                        </div>

                        <h2>{selectedSupportInfo.name}</h2>

                        <p>{selectedSupportInfo.description}</p>

                        <div className="smart-dashboard-meta">
                          <span className="smart-dashboard-status">
                            <span>✓</span>
                            {verificationLabel}
                          </span>

                          <span>
                            {selectedSupportInfo.applicationType}
                          </span>

                          <span>
                            Verified {selectedSupportInfo.lastVerified}
                          </span>
                        </div>

                      </div>

                    </div>

                    <div className="smart-dashboard-readiness">

                      <div
                        className="smart-readiness-ring"
                        style={{
                          background: `conic-gradient(var(--sde-green) ${readinessPercent * 3.6}deg, #e8edf3 0deg)`,
                        }}
                      >
                        <div className="smart-readiness-ring-inner">
                          <strong>{readinessPercent}%</strong>
                          <span>ready</span>
                        </div>
                      </div>

                      <div>
                        <span>APPLICATION</span>
                        <strong>Preparation readiness</strong>
                        <small>
                          Complete the form to prepare your support request.
                        </small>
                      </div>

                    </div>

                  </div>

                  <div className="smart-hec-notice">

                    <div className="smart-hec-icon">!</div>

                    <div className="smart-hec-content">

                      <div className="smart-hec-title-row">

                        <div>
                          <strong>
                            {HEC_2026_2027_NOTICE.title}
                          </strong>

                          <span>
                            {HEC_2026_2027_NOTICE.date} •{" "}
                            {HEC_2026_2027_NOTICE.academicYear}
                          </span>
                        </div>

                        <span className="smart-hec-badge">
                          HEC BASELINE
                        </span>

                      </div>

                      <ul>
                        {HEC_2026_2027_NOTICE.rules.map((rule) => (
                          <li key={rule}>
                            <span>✓</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>

                    </div>

                  </div>

                  {selectedSupportInfo.verificationStatus ===
                    "GENERAL_GUIDANCE_ONLY" && (
                    <div className="smart-dashboard-warning">
                      <span>⚠</span>

                      <div>
                        <strong>
                          Confirmation needed before applying
                        </strong>

                        <p>
                          This section currently provides general guidance.
                          Exact programme rules should be confirmed with the
                          institution before you submit an official application.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="smart-dashboard-tabs" role="tablist">

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "eligibility"}
                      className={
                        activeSupportPanel === "eligibility"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("eligibility")
                      }
                    >
                      <span>✓</span>
                      <strong>Eligibility</strong>
                      <small>Requirements</small>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "programmes"}
                      className={
                        activeSupportPanel === "programmes"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("programmes")
                      }
                    >
                      <span>⌘</span>
                      <strong>Programmes</strong>
                      <small>Study choices</small>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "documents"}
                      className={
                        activeSupportPanel === "documents"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("documents")
                      }
                    >
                      <span>↗</span>
                      <strong>Documents</strong>
                      <small>Prepare files</small>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "funding"}
                      className={
                        activeSupportPanel === "funding"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("funding")
                      }
                    >
                      <span>✦</span>
                      <strong>Funding</strong>
                      <small>Scholarships</small>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "important"}
                      className={
                        activeSupportPanel === "important"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("important")
                      }
                    >
                      <span>!</span>
                      <strong>Important</strong>
                      <small>Before applying</small>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSupportPanel === "support"}
                      className={
                        activeSupportPanel === "support"
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSupportPanel("support")
                      }
                    >
                      <span>?</span>
                      <strong>SDE Help</strong>
                      <small>Our support</small>
                    </button>

                  </div>

                  <div className="smart-dashboard-panel">

                    {activeSupportPanel === "eligibility" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon requirements">
                            ✓
                          </div>

                          <div>
                            <span>CHECK THIS FIRST</span>
                            <h3>Admission requirements</h3>
                            <p>
                              Review the available guidance before continuing.
                            </p>
                          </div>
                        </div>

                        <div className="smart-panel-list">
                          {selectedSupportInfo.requirements.map((item) => (
                            <div
                              className="smart-panel-list-item"
                              key={item}
                            >
                              <span>✓</span>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                    {activeSupportPanel === "programmes" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon programmes">
                            ⌘
                          </div>

                          <div>
                            <span>CHOOSE CAREFULLY</span>
                            <h3>Programme guidance</h3>
                            <p>
                              Use this information to prepare your study choices.
                            </p>
                          </div>
                        </div>

                        <div className="smart-panel-list">
                          {selectedSupportInfo.choices.length > 0 ? (
                            selectedSupportInfo.choices.map((item) => (
                              <div
                                className="smart-panel-list-item"
                                key={item}
                              >
                                <span>→</span>
                                <p>{item}</p>
                              </div>
                            ))
                          ) : (
                            <div className="smart-panel-empty">
                              Programme-choice guidance is not currently
                              available here. SDE can help you check the
                              institution's current programme information.
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {activeSupportPanel === "documents" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon documents">
                            ↗
                          </div>

                          <div>
                            <span>GET READY</span>
                            <h3>Documents to prepare</h3>
                            <p>
                              Keep your documents clear, complete and readable.
                            </p>
                          </div>
                        </div>

                        <div className="smart-panel-list">
                          {selectedSupportInfo.documents.map((item) => (
                            <div
                              className="smart-panel-list-item"
                              key={item}
                            >
                              <span>✓</span>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>

                        <div className="smart-document-note">
                          <span>ⓘ</span>
                          <p>
                            SDE's current form records your information, but
                            uploaded documents are not yet transmitted to the
                            SDE server by this form.
                          </p>
                        </div>

                      </div>
                    )}

                    {activeSupportPanel === "funding" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon funding">
                            ✦
                          </div>

                          <div>
                            <span>FUNDING OPTIONS</span>
                            <h3>Scholarships & financial aid</h3>
                            <p>
                              Funding information currently listed for this
                              institution.
                            </p>
                          </div>
                        </div>

                        <div className="smart-panel-list">
                          {selectedSupportInfo.scholarship.length > 0 ? (
                            selectedSupportInfo.scholarship.map((item) => (
                              <div
                                className="smart-panel-list-item"
                                key={item}
                              >
                                <span>✦</span>
                                <p>{item}</p>
                              </div>
                            ))
                          ) : (
                            <div className="smart-panel-empty">
                              No scholarship information is currently listed
                              here. SDE can help check funding opportunities
                              separately.
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {activeSupportPanel === "important" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon important">
                            !
                          </div>

                          <div>
                            <span>READ BEFORE APPLYING</span>
                            <h3>Important information</h3>
                            <p>
                              Rules and reminders that may affect your
                              application.
                            </p>
                          </div>
                        </div>

                        <div className="smart-panel-list">
                          {selectedSupportInfo.important.length > 0 ? (
                            selectedSupportInfo.important.map((item) => (
                              <div
                                className="smart-panel-list-item"
                                key={item}
                              >
                                <span>!</span>
                                <p>{item}</p>
                              </div>
                            ))
                          ) : (
                            <div className="smart-panel-empty">
                              No additional important notes are currently
                              listed.
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {activeSupportPanel === "support" && (
                      <div className="smart-panel-content">

                        <div className="smart-panel-heading">
                          <div className="smart-panel-icon support">
                            ?
                          </div>

                          <div>
                            <span>SDE CAREER CONNECT</span>
                            <h3>How SDE can help you</h3>
                            <p>
                              We help you understand the process and prepare
                              your application information.
                            </p>
                          </div>
                        </div>

                        <div className="smart-support-message">
                          <span>💡</span>
                          <p>{selectedSupportInfo.supportNote}</p>
                        </div>

                        <div className="smart-support-actions">

                          {selectedSupportInfo.officialApplicationUrl && (
                            <a
                              href={selectedSupportInfo.officialApplicationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="smart-official-button"
                            >
                              Official application
                              <span>↗</span>
                            </a>
                          )}

                          {selectedSupportInfo.officialWebsite && (
                            <a
                              href={selectedSupportInfo.officialWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="smart-website-button"
                            >
                              Official website
                              <span>↗</span>
                            </a>
                          )}

                        </div>

                      </div>
                    )}

                  </div>

                  <div className="smart-readiness-checklist">

                    <div className="smart-checklist-heading">

                      <div>
                        <span>YOUR PREPARATION</span>
                        <strong>Application readiness</strong>
                      </div>

                      <b>{readinessPercent}%</b>

                    </div>

                    <div className="smart-checklist-track">
                      <div
                        className="smart-checklist-fill"
                        style={{ width: `${readinessPercent}%` }}
                      />
                    </div>

                    <div className="smart-checklist-items">
                      {readinessChecks.map((item) => (
                        <div
                          className={`smart-checklist-item ${
                            item.done ? "done" : ""
                          }`}
                          key={item.label}
                        >
                          <span>{item.done ? "✓" : "○"}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>

                  </div>

                </section>
              )}

          {step === 2 && (
            <section className="form-step">
              <div className="intro-block">
                <span className="section-tag">YOUR DETAILS</span>
                <h1>Let's get to know you.</h1>
                <p>
                  Enter your information carefully. Fields marked with *
                  are required.
                </p>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Personal information</h3>
                    <p>Your basic identification and contact details.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <Field
                    label="FULL NAMES"
                    required
                    value={data.fullNames}
                    error={errors.fullNames}
                    onChange={(value) => update("fullNames", value)}
                    placeholder="Enter your full names"
                  />

                  <div className="field">
                    <label>GENDER *</label>
                    <div className="gender-options">
                      {["Male", "Female", "Other"].map((gender) => (
                        <button
                          type="button"
                          key={gender}
                          className={
                            data.gender === gender ? "gender-selected" : ""
                          }
                          onClick={() => update("gender", gender)}
                        >
                          <span>
                            {gender === "Male"
                              ? "♂"
                              : gender === "Female"
                              ? "♀"
                              : "○"}
                          </span>
                          {gender}
                        </button>
                      ))}
                    </div>
                    {errors.gender && (
                      <p className="field-error">{errors.gender}</p>
                    )}
                  </div>

                  <Field
                    label="INDEX NUMBER"
                    value={data.indexNumber}
                    onChange={(value) => update("indexNumber", value)}
                    placeholder="e.g. 123456789"
                  />

                  <Field
                    label="NATIONAL ID"
                    value={data.nationalId}
                    onChange={(value) => update("nationalId", value)}
                    placeholder="Enter your National ID number"
                  />

                  <Field
                    label="YOUR EMAIL"
                    required
                    type="email"
                    value={data.email}
                    error={errors.email}
                    onChange={(value) => update("email", value)}
                    placeholder="you@example.com"
                  />

                  <Field
                    label="PHONE NUMBER"
                    required
                    type="tel"
                    value={data.phone}
                    error={errors.phone}
                    onChange={(value) => update("phone", value)}
                    placeholder="+250 7XX XXX XXX"
                  />

                  <Field
                    label="DATE OF BIRTH"
                    required
                    type="date"
                    value={data.dateOfBirth}
                    error={errors.dateOfBirth}
                    onChange={(value) => update("dateOfBirth", value)}
                  />

                  <Field
                    label="TRADE OR OPTION THAT YOU'VE STUDIED"
                    value={data.tradeOption}
                    onChange={(value) => update("tradeOption", value)}
                    placeholder="e.g. PCM, MCB, Software Development..."
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>02</span>
                  <div>
                    <h3>RESIDENTIAL ADDRESS — AHO UTUYE</h3>
                    <p>Help us understand where you currently live.</p>
                  </div>
                </div>

                <div className="form-grid address-grid">
                  <Field
                    label="PROVINCE / INTARA"
                    required
                    value={data.province}
                    error={errors.province}
                    onChange={(value) => update("province", value)}
                    placeholder="e.g. Eastern Province"
                  />

                  <Field
                    label="DISTRICT / AKARERE"
                    required
                    value={data.district}
                    error={errors.district}
                    onChange={(value) => update("district", value)}
                    placeholder="e.g. Nyagatare"
                  />

                  <Field
                    label="SECTOR / UMURENGE"
                    required
                    value={data.sector}
                    error={errors.sector}
                    onChange={(value) => update("sector", value)}
                    placeholder="Enter sector"
                  />

                  <Field
                    label="CELL / AKAGARI"
                    required
                    value={data.cell}
                    error={errors.cell}
                    onChange={(value) => update("cell", value)}
                    placeholder="Enter cell"
                  />

                  <Field
                    label="VILLAGE / UMUDUGUDU"
                    required
                    value={data.village}
                    error={errors.village}
                    onChange={(value) => update("village", value)}
                    placeholder="Enter village"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>03</span>
                  <div>
                    <h3>Additional information</h3>
                    <p>This helps us provide more appropriate guidance.</p>
                  </div>
                </div>

                <div className="field">
                  <label>DO YOU HAVE DISABILITY? *</label>
                  <div className="choice-row">
                    {["Yes", "No"].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          data.disability === option ? "choice-selected" : ""
                        }
                        onClick={() => update("disability", option)}
                      >
                        <span>{data.disability === option ? "✓" : ""}</span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {errors.disability && (
                    <p className="field-error">{errors.disability}</p>
                  )}
                </div>

                {data.disability === "Yes" && (
                  <Field
                    label="PLEASE TELL US MORE (OPTIONAL)"
                    value={data.disabilityDetails}
                    onChange={(value) => update("disabilityDetails", value)}
                    placeholder="Tell us anything we should consider when supporting you"
                  />
                )}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="form-step">
              <div className="intro-block">
                <span className="section-tag">DOCUMENTS</span>
                <h1>Upload your documents.</h1>
                <p>
                  Clear documents help our team give you accurate application
                  guidance.
                </p>
              </div>

              <div className="photo-instruction">
                <span>📸</span>
                <div>
                  <strong>Passport photo requirement</strong>
                  <p>
                    PLEASE MAKE SURE KO AMATWI YOSE AGARAGARA KANDI NISURA IKABA
                    IGARAGARA KUBURYO UMUNTU URI KURI ID ABA ARI UMWE NURI KURI
                    PASSPORT PHOTO
                  </p>
                </div>
              </div>

              <div className="upload-grid">
                <FileUpload
                  id="passport-photo"
                  title="UPLOAD YOUR PASSPORT PHOTO"
                  description="JPG, PNG or WEBP · Maximum 8 MB"
                  required
                  file={data.passportPhoto}
                  error={errors.passportPhoto}
                  onChange={(event) => handleFile("passportPhoto", event)}
                  accept="image/jpeg,image/png,image/webp"
                  icon="📸"
                />

                <FileUpload
                  id="national-id-photo"
                  title="UPLOAD YOUR NATIONAL ID PHOTO"
                  description="Clear image of your National ID · Maximum 8 MB"
                  required
                  file={data.nationalIdPhoto}
                  error={errors.nationalIdPhoto}
                  onChange={(event) => handleFile("nationalIdPhoto", event)}
                  accept="image/jpeg,image/png,image/webp"
                  icon="🪪"
                />

                <FileUpload
                  id="result-slip"
                  title="UPLOAD YOUR RESULT SLIP / DIPLOMA"
                  description="JPG, PNG or PDF · Maximum 8 MB"
                  required
                  file={data.resultSlip}
                  error={errors.resultSlip}
                  onChange={(event) => handleFile("resultSlip", event)}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  icon="📄"
                />
              </div>

              <div className="security-note">
                <span>🔒</span>
                <div>
                  <strong>Your documents are sensitive information.</strong>
                  <p>
                    Keep your original documents safe. This application flow
                    does not expose your uploaded files through a public URL.
                  </p>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="form-step">
              <div className="intro-block">
                <span className="section-tag">
                  {data.institution === "UR"
                    ? "UR PROGRAMME PREFERENCES"
                    : "YOUR CHOICES"}
                </span>
                <h1>
                  {data.institution === "UR"
                    ? "Review your 3 programme choices."
                    : "What would you like to study?"}
                </h1>
                <p>
                  {data.institution === "UR"
                    ? "These are the programme preferences you selected in the SDE Opportunity Finder. Your order matters."
                    : "Give us three options. If you are not sure, don't worry — we can help you identify suitable programmes."}
                </p>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>01</span>
                  <div>
                    <h3>REFUGEE STATUS</h3>
                    <p>This information can help identify relevant opportunities.</p>
                  </div>
                </div>

                <div className="field">
                  <label>ARE YOU REFUGEE? *</label>
                  <div className="choice-row">
                    {["Yes", "No"].map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          data.refugee === option ? "choice-selected" : ""
                        }
                        onClick={() => update("refugee", option)}
                      >
                        <span>{data.refugee === option ? "✓" : ""}</span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {errors.refugee && (
                    <p className="field-error">{errors.refugee}</p>
                  )}
                </div>
              </div>

              <div className="form-section choices-section">
                {data.institution === "UR" &&
                initialURChoices &&
                initialURChoices.some(Boolean) ? (
                  <div className="ur-imported-choices">
                    <div className="ur-imported-header">
                      <div className="ur-imported-brand">
                        <div className="ur-imported-logo">
                          <img
                            src="/assets/universities/ur-logo.png"
                            alt="University of Rwanda"
                          />
                        </div>
                        <div>
                          <span className="ur-imported-kicker">
                            UNIVERSITY OF RWANDA
                          </span>
                          <h3>Your programme preferences</h3>
                          <p>
                            These choices were imported automatically from the
                            SDE Opportunity Finder.
                          </p>
                        </div>
                      </div>

                      <div className="ur-imported-status">
                        <span className="ur-imported-status-dot" />
                        <span>3 CHOICES IMPORTED</span>
                      </div>
                    </div>

                    <div className="ur-imported-notice">
                      <span className="ur-imported-notice-icon">✓</span>
                      <div>
                        <strong>No retyping required</strong>
                        <p>
                          SDE has carried your three ordered programme choices
                          into this application-support request.
                        </p>
                      </div>
                    </div>

                    <div className="ur-imported-choice-list">
                      {[
                        {
                          number: "01",
                          label: "CHOICE 1",
                          value: data.faculty1,
                          medal: "🥇",
                        },
                        {
                          number: "02",
                          label: "CHOICE 2",
                          value: data.faculty2,
                          medal: "🥈",
                        },
                        {
                          number: "03",
                          label: "CHOICE 3",
                          value: data.faculty3,
                          medal: "🥉",
                        },
                      ].map((choice) => (
                        <article
                          key={choice.number}
                          className="ur-imported-choice-card"
                        >
                          <div className="ur-imported-choice-medal">
                            {choice.medal}
                          </div>

                          <div className="ur-imported-choice-number">
                            {choice.number}
                          </div>

                          <div className="ur-imported-choice-content">
                            <span>{choice.label}</span>
                            <strong>
                              {choice.value || "Programme not selected"}
                            </strong>
                          </div>

                          <div className="ur-imported-choice-check">
                            ✓
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="ur-imported-footer">
                      <div>
                        <strong>Your order matters.</strong>
                        <span>
                          Choice 1 is your first preference, followed by
                          Choice 2 and Choice 3.
                        </span>
                      </div>

                      <a
                        href="https://wa.me/250796371484"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Need to change a choice? Contact SDE ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-section-heading">
                      <span>02</span>
                      <div>
                        <h3>PROGRAMME PREFERENCES — 3 OPTIONS</h3>
                        <p>
                          Select or enter your preferred programmes in order.
                          If you are unsure, SDE can help you choose.
                        </p>
                      </div>
                    </div>

                    <div className="help-note">
                      <span>💡</span>
                      <div>
                        <strong>Not sure what to choose?</strong>
                        <p>
                          That's completely okay. Our team can guide you based
                          on your qualification, subjects and interests.
                        </p>
                        <a
                          href="https://wa.me/250796371484"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Get programme guidance on WhatsApp ↗
                        </a>
                      </div>
                    </div>

                    <div className="faculty-list">
                      <ChoiceField
                        number="01"
                        label="FIRST OPTION"
                        value={data.faculty1}
                        error={errors.faculty1}
                        onChange={(value) => update("faculty1", value)}
                        placeholder="Enter faculty / programme"
                      />

                      <ChoiceField
                        number="02"
                        label="SECOND OPTION"
                        value={data.faculty2}
                        error={errors.faculty2}
                        onChange={(value) => update("faculty2", value)}
                        placeholder="Enter faculty / programme"
                      />

                      <ChoiceField
                        number="03"
                        label="THIRD OPTION"
                        value={data.faculty3}
                        error={errors.faculty3}
                        onChange={(value) => update("faculty3", value)}
                        placeholder="Enter faculty / programme"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
          )}


          {step === 4 && data.institution === "UR" && (
            <div className="ur-support-bottom-note">
              <span className="ur-support-bottom-note-icon">ⓘ</span>
              <div>
                <strong>SDE PROGRAMME PLANNING</strong>
                <p>
                  Your three choices are your SDE planning preferences. Final
                  programme availability, eligibility and admission decisions
                  remain subject to the University of Rwanda's official
                  admission process and requirements.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <section className="form-step">
              <div className="intro-block">
                <span className="section-tag">FINAL CHECK</span>
                <h1>Review your application.</h1>
                <p>
                  Check your information carefully before sending your support
                  request.
                </p>
              </div>

              <div className="review-institution">
                <div className="review-logo">
                  {institutionLogo && (
                    <img
                      src={institutionLogo}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <span>{selectedInstitution?.short}</span>
                </div>
                <div>
                  <span>SELECTED INSTITUTION</span>
                  <strong>{selectedInstitution?.name || "Not selected"}</strong>
                </div>
                <button type="button" onClick={() => setStep(1)}>
                  Edit
                </button>
              </div>

              <ReviewSection
                title="Personal information"
                onEdit={() => setStep(2)}
              >
                <ReviewRow label="Full names" value={data.fullNames} />
                <ReviewRow label="Gender" value={data.gender} />
                <ReviewRow
                  label="Address"
                  value={[
                    data.province,
                    data.district,
                    data.sector,
                    data.cell,
                    data.village,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />
                <ReviewRow label="Index number" value={data.indexNumber} />
                <ReviewRow
                  label="National ID"
                  value={maskValue(data.nationalId)}
                />
                <ReviewRow label="Email" value={data.email} />
                <ReviewRow label="Phone" value={data.phone} />
                <ReviewRow label="Date of birth" value={data.dateOfBirth} />
                <ReviewRow label="Trade / option" value={data.tradeOption} />
                <ReviewRow label="Disability" value={data.disability} />
              </ReviewSection>

              <ReviewSection
                title="Documents"
                onEdit={() => setStep(3)}
              >
                <ReviewFile label="Passport photo" file={data.passportPhoto} />
                <ReviewFile label="National ID photo" file={data.nationalIdPhoto} />
                <ReviewFile label="Result slip / diploma" file={data.resultSlip} />
              </ReviewSection>

              <ReviewSection
                title="Choices & additional information"
                onEdit={() => setStep(4)}
              >
                <ReviewRow label="Refugee" value={data.refugee} />
                <ReviewRow label="First choice" value={data.faculty1} />
                <ReviewRow label="Second choice" value={data.faculty2} />
                <ReviewRow label="Third choice" value={data.faculty3} />
              </ReviewSection>

              <div className="sde-portal-disclaimer">
            <div className="sde-portal-disclaimer-icon">i</div>
            <div>
              <strong>SDE Career Connect is a guidance service</strong>
              <p>
                SDE Career Connect is <strong>not the official application portal</strong>
                of the selected university. We help you prepare your information,
                documents and programme choices so you can apply correctly through
                the institution's official process.
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error-banner" role="alert">
              <span className="submit-error-icon" aria-hidden="true">
                !
              </span>

              <div className="submit-error-content">
                <strong>We couldn't submit your request</strong>
                <p>{errors.submit}</p>
                <small>
                  Please check the information above and try again.
                </small>
              </div>
            </div>
          )}

          <label className="consent-box">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(event) =>
                    update("consent", event.target.checked)
                  }
                />
                <span>
                  I confirm that the information I have provided is accurate
                  and that SDE Career Connect may use it to provide application
                  support.
                </span>
              </label>

              {errors.consent && (
                <p className="field-error">{errors.consent}</p>
              )}
            </section>
          )}
        </main>

        <footer className="application-footer">
          <div className="footer-hint">
            {step === 1 && "Choose an institution to continue."}
            {step === 2 && "Your information is saved automatically on this device."}
            {step === 3 && "Make sure all required documents are clear and readable."}
            {step === 4 && "You can change your choices before submitting."}
            {step === 5 && "Almost done — check everything one last time."}
          </div>

          <div className="footer-actions">
            {step > 1 && (
              <button
                type="button"
                className="back-action"
                onClick={previousStep}
              >
                ← Back
              </button>
            )}

            {step < steps.length ? (
              <button
                type="button"
                className="primary-action"
                onClick={nextStep}
              >
                Continue
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                className="primary-action submit-action"
                onClick={() => void submit()}
                disabled={saving}
              >
                {saving ? "Sending..." : "Submit support request"}
                {!saving && <span>✓</span>}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

const Field = ({
  label,
  required,
  type = "text",
  value,
  error,
  placeholder,
  onChange,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) => (
  <div className="field">
    <label>
      {label} {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <p className="field-error">{error}</p>}
  </div>
);

const ChoiceField = ({
  number,
  label,
  value,
  error,
  placeholder,
  onChange,
}: {
  number: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) => (
  <div className="choice-field">
    <div className="choice-number">{number}</div>
    <div className="field">
      <label>{label} *</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  </div>
);

const FileUpload = ({
  id,
  title,
  description,
  required,
  file,
  error,
  onChange,
  accept,
  icon,
}: {
  id: string;
  title: string;
  description: string;
  required?: boolean;
  file: UploadedFile | null;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  icon: string;
}) => (
  <div className={`upload-card ${file ? "has-file" : ""}`}>
    <label htmlFor={id} className="upload-label">
      <div className="upload-icon">{icon}</div>
      <div className="upload-copy">
        <strong>
          {title} {required && "*"}
        </strong>

        {file ? (
          <div className="selected-file">
            <span>{file.name}</span>
            <small>{formatBytes(file.size)}</small>
          </div>
        ) : (
          <>
            <p>{description}</p>
            <span className="upload-cta">Choose file →</span>
          </>
        )}
      </div>
    </label>

    <input id={id} type="file" accept={accept} onChange={onChange} />

    {error && <p className="field-error upload-error">{error}</p>}
  </div>
);

const ReviewSection = ({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) => (
  <div className="review-section">
    <div className="review-section-header">
      <h3>{title}</h3>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
    </div>
    <div className="review-grid">{children}</div>
  </div>
);

const ReviewRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="review-row">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const ReviewFile = ({
  label,
  file,
}: {
  label: string;
  file: UploadedFile | null;
}) => (
  <div className="review-file">
    <span>✓</span>
    <div>
      <strong>{label}</strong>
      <small>{file?.name || "Not uploaded"}</small>
    </div>
  </div>
);

export default ApplicationSupport;
