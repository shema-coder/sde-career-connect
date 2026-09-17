import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_UR_CHOICES,
  areURChoicesComplete,
  hasDuplicateURChoices,
  setURChoice,
  type URPreference,
  type URProgrammeChoice,
  type URThreeChoices,
} from "../data/universities/urChoices";

type Pathway =
  | "General Education"
  | "TSS / TVET"
  | "TTC"
  | "Cambridge / International"
  | "International / Other"
  | "I'm not sure";

type Field =
  | "Technology & ICT"
  | "Engineering"
  | "Health & Medicine"
  | "Agriculture"
  | "Business & Economics"
  | "Education"
  | "Social Sciences"
  | "Tourism & Hospitality"
  | "Creative Arts & Design"
  | "Show me everything";

type Institution = "University of Rwanda" | "Rwanda Polytechnic";

type MatchStatus =
  | "Verified current"
  | "Historical reference"
  | "Needs verification"
  | "No verified information";

type Programme = {
  id: string;
  institution: Institution;
  programme: string;
  field: Exclude<Field, "Show me everything">;
  pathways: Pathway[];
  acceptedQualifications: string[];
  aliases?: string[];
  historicalCutoff?: number;
  historicalYear?: string;
  historicalNote?: string;
  currentGuidance: string;
  status: MatchStatus;
  sourceUrl: string;
  sourceLabel: string;
};

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  coverage: string;
  sourceUrl: string;
  sourceLabel: string;
};

const UR_ENTRY_REQUIREMENTS =
  "https://applications.ur.ac.rw/nesa/public-details/entry-requirements.php";

const UR_ADMISSION_CRITERIA =
  "https://ur.ac.rw/spip.php?page=Admission-criteria";

const RP_PROGRAMMES = "https://new.rp.ac.rw/programmes/";

const RP_APPLICATION = "https://new.rp.ac.rw/online-application/";

const HEC_SCHOLARSHIPS =
  "https://www.hec.gov.rw/updates/scholarships";

const RICA_REQUIREMENTS =
  "https://www.rica.rw/admissions/eligibility-requirements/";

const ALU_FINANCIAL_AID =
  "https://www.alueducation.com/financial-aid-at-alu/";

const WHATSAPP_NUMBER = "250796371484";

const WHATSAPP_GROUP =
  "https://chat.whatsapp.com/KdxQwE1skoLIsmLC3i0HmK";

const normalize = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");

const compact = (value: string) =>
  normalize(value).replace(/[\s_-]/g, "");

const isExactQualification = (
  input: string,
  accepted: string[],
) => {
  const value = compact(input);
  if (!value) return false;

  return accepted.some((item) => compact(item) === value);
};

const isAliasMatch = (
  input: string,
  aliases: string[] = [],
) => {
  const value = compact(input);
  return aliases.some(
    (alias) =>
      compact(alias) === value ||
      value.includes(compact(alias)) ||
      compact(alias).includes(value),
  );
};

const PROGRAMMES: Programme[] = [
  {
    id: "ur-bit",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Business Information Technology",
    field: "Technology & ICT",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: [
      "MPG",
      "PCM",
      "MEG",
      "MCE",
      "MPC",
      "MCB",
      "SOD",
      "NET",
      "ELS",
      "ETE",
      "SPE",
      "CSA",
      "NIT",
    ],
    aliases: [
      "Software Development",
      "Networking",
      "Electronic Services",
      "Telecommunication",
    ],
    historicalCutoff: 55,
    historicalYear: "2024 admission criteria",
    historicalNote:
      "UR's historical criteria listed 55 for General Education and 60 for TSS.",
    currentGuidance:
      "UR's current entry database explicitly lists several General Education combinations and TVET/technical qualifications for this programme.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-english-french",
    institution: "University of Rwanda",
    programme: "BA (Hons) in English and French",
    field: "Education",
    pathways: ["General Education"],
    acceptedQualifications: ["LFK", "LKF"],
    historicalCutoff: 53,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "The current UR database lists LFK and LKF among the eligible combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-history",
    institution: "University of Rwanda",
    programme: "BSS (Hons) in History and Heritage Studies",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "LFK",
      "LKF",
      "LKK",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "HLP",
    ],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "The current UR database lists multiple humanities and social-science combinations for this programme.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-journalism",
    institution: "University of Rwanda",
    programme: "BA (Hons) in Journalism and Communication",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "LFK",
      "LKF",
      "LKK",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "HLP",
    ],
    historicalCutoff: 60,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR requirements list a range of General Education combinations for Journalism and Communication.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-public-admin",
    institution: "University of Rwanda",
    programme: "BSS (Hons) in Public Administration and Governance",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "MEG",
      "MCE",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "LFK",
      "LKK",
      "LKF",
      "HLP",
    ],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "The current UR entry database lists several humanities, social-science and economics combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-political",
    institution: "University of Rwanda",
    programme: "BSS (Hons) in Political Science",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "MEG",
      "MCE",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "LFK",
      "LKK",
      "LKF",
      "HLP",
    ],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "The current UR entry database lists multiple General Education combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-sociology",
    institution: "University of Rwanda",
    programme: "BSS (Hons) in Sociology",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "MEG",
      "MCE",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "LFK",
      "LKK",
      "LKF",
      "HLP",
    ],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR requirements list multiple General Education combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-social-work",
    institution: "University of Rwanda",
    programme: "BSS (Hons) in Social Work",
    field: "Social Sciences",
    pathways: ["General Education"],
    acceptedQualifications: [
      "MEG",
      "MCE",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "LFK",
      "LKK",
      "LKF",
      "HLP",
    ],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR requirements list multiple General Education combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-educational-psychology",
    institution: "University of Rwanda",
    programme: "BEd with Honours in Educational Psychology",
    field: "Education",
    pathways: ["General Education", "TTC"],
    acceptedQualifications: [
      "HLP",
      "LE",
      "SSE",
      "SME",
      "ECLPE",
    ],
    currentGuidance:
      "UR currently lists HLP plus specific TTC pathways including LE, SSE, SME and ECLPE.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-special-needs",
    institution: "University of Rwanda",
    programme: "BEd with Honours in Special Needs Education",
    field: "Education",
    pathways: ["TTC", "General Education"],
    acceptedQualifications: [
      "LE",
      "SSE",
      "SME",
      "ECLPE",
    ],
    currentGuidance:
      "UR currently lists specific TTC pathways for this programme.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-computer-science",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Computer Science",
    field: "Technology & ICT",
    pathways: ["General Education"],
    acceptedQualifications: ["MPG", "PCM", "MCE", "MPC"],
    historicalCutoff: 55,
    historicalYear: "2024 admission criteria",
    historicalNote:
      "Historical reference; not a guarantee of current admission.",
    currentGuidance:
      "Current UR entry requirements list MPG, PCM, MCE and MPC.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-computer-engineering",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Computer Engineering",
    field: "Engineering",
    pathways: ["General Education"],
    acceptedQualifications: ["MPG", "PCM", "MCE", "MPC"],
    historicalCutoff: 57,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR entry requirements list MPG, PCM, MCE and MPC.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-it",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Information Technology",
    field: "Technology & ICT",
    pathways: ["General Education"],
    acceptedQualifications: ["MPG", "PCM", "MCE", "MPC"],
    historicalCutoff: 55,
    historicalYear: "2024 admission criteria",
    historicalNote:
      "Historical reference; current competition and requirements may differ.",
    currentGuidance:
      "Current UR entry requirements list MPG, PCM, MCE and MPC.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-biochemistry",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Biochemistry",
    field: "Health & Medicine",
    pathways: ["General Education"],
    acceptedQualifications: ["PCB", "MCB"],
    historicalCutoff: 52,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR requirements list PCB and MCB for Biochemistry.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-biotechnology",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Biotechnology",
    field: "Health & Medicine",
    pathways: ["General Education"],
    acceptedQualifications: ["PCB", "MCB"],
    historicalCutoff: 55,
    historicalYear: "2024 admission criteria",
    currentGuidance:
      "Current UR requirements list PCB and MCB.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-medicine",
    institution: "University of Rwanda",
    programme: "Bachelor of Medicine and Bachelor of Surgery",
    field: "Health & Medicine",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: ["PCB", "MCB", "ANP"],
    currentGuidance:
      "UR currently lists PCB, MCB and ANP for Medicine. Other health-related qualifications should not be assumed equivalent.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-nursing",
    institution: "University of Rwanda",
    programme: "BSc (Hons) in Nursing",
    field: "Health & Medicine",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: ["PCB", "BCG", "MCB", "ANP"],
    currentGuidance:
      "UR currently lists PCB, BCG, MCB and ANP.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-pharmacy",
    institution: "University of Rwanda",
    programme: "Bachelor of Pharmacy",
    field: "Health & Medicine",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: ["PCB", "MCB", "ANP"],
    currentGuidance:
      "UR currently lists PCB, MCB and ANP.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-visual-design",
    institution: "University of Rwanda",
    programme: "Bachelor of Design in Visual Design",
    field: "Creative Arts & Design",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: [
      "MPG",
      "PCM",
      "PCB",
      "MCE",
      "MPC",
      "MCB",
      "MUL",
      "GRA",
      "MMP",
    ],
    aliases: ["Multimedia", "Graphics Arts", "Multimedia Production"],
    currentGuidance:
      "UR's current entry database includes Multimedia, Graphics Arts and Multimedia Production alongside several General Education combinations.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },
  {
    id: "ur-industrial-design",
    institution: "University of Rwanda",
    programme: "Bachelor of Design in Industrial Design",
    field: "Creative Arts & Design",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: [
      "MPG",
      "PCM",
      "PCB",
      "MCE",
      "MPC",
      "MCB",
      "TAL",
      "CSC",
      "IND",
    ],
    aliases: ["Tailoring", "Ceramics & Sculpture", "Interior Design"],
    currentGuidance:
      "UR's current entry database includes specific technical/design qualifications such as Tailoring, Ceramics & Sculpture and Interior Design.",
    status: "Verified current",
    sourceUrl: UR_ENTRY_REQUIREMENTS,
    sourceLabel: "UR official entry requirements",
  },

  // RP current programme catalogue — these are programme listings.
  // We deliberately mark exact eligibility as "Needs verification"
  // unless the current source provides the specific qualification route.
  {
    id: "rp-automobile",
    institution: "Rwanda Polytechnic",
    programme: "Automobile Technology",
    field: "Engineering",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: ["Automobile Technology"],
    aliases: ["Automobile", "Automotive Technology"],
    currentGuidance:
      "RP currently lists Automobile Technology. RP's current application page states that applicants may come from General Education S6 or TVET Level 5 with relevant principal passes, but exact programme eligibility should be checked for the current intake.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-it",
    institution: "Rwanda Polytechnic",
    programme: "Information Technology",
    field: "Technology & ICT",
    pathways: ["General Education", "TSS / TVET"],
    acceptedQualifications: [
      "Software Development",
      "Networking",
      "Information Technology",
      "MCE",
      "MPC",
      "MPG",
      "PCM",
      "MEG",
    ],
    currentGuidance:
      "RP currently lists Information Technology and accepts applicants from S6 General Education or Level 5 TVET subject to relevant principal passes. Exact qualification-to-programme eligibility should be checked in the current intake.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-mechatronics",
    institution: "Rwanda Polytechnic",
    programme: "Mechatronics Technology",
    field: "Engineering",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Mechatronics",
      "Mechanical",
      "Electronics",
      "Electrical",
      "MPC",
      "PCM",
      "MPG",
    ],
    currentGuidance:
      "RP currently lists Mechatronics Technology. Exact current qualification requirements should be verified before applying.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-electronics",
    institution: "Rwanda Polytechnic",
    programme: "Electronics and Telecommunication Technology",
    field: "Technology & ICT",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Electronics",
      "Telecommunication",
      "Electronic Services",
      "MPC",
      "PCM",
      "MPG",
    ],
    currentGuidance:
      "RP currently lists Electronics and Telecommunication Technology. Exact current qualification requirements should be verified.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-construction",
    institution: "Rwanda Polytechnic",
    programme: "Construction Technology",
    field: "Engineering",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Construction",
      "Building Construction",
      "Civil Engineering",
      "PCM",
      "MPG",
      "MPC",
    ],
    currentGuidance:
      "RP currently lists Construction Technology. Exact current qualification requirements should be verified.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-tourism",
    institution: "Rwanda Polytechnic",
    programme: "Tourism Management",
    field: "Tourism & Hospitality",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Tourism",
      "HEG",
      "MEG",
      "MCB",
      "BCG",
      "Languages",
    ],
    currentGuidance:
      "RP currently lists Tourism Management. Exact current qualification requirements should be checked against the current programme call.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-electrical",
    institution: "Rwanda Polytechnic",
    programme: "Electrical Technology",
    field: "Engineering",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Electrical",
      "Electronics",
      "MPC",
      "PCM",
      "MPG",
    ],
    currentGuidance:
      "RP currently lists Electrical Technology. Exact current qualification requirements should be verified.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
  {
    id: "rp-agriculture",
    institution: "Rwanda Polytechnic",
    programme: "Crop Production",
    field: "Agriculture",
    pathways: ["TSS / TVET", "General Education"],
    acceptedQualifications: [
      "Agriculture",
      "Crop Production",
      "PCB",
      "MCB",
      "BCG",
    ],
    currentGuidance:
      "RP currently lists Crop Production. Exact current qualification requirements should be checked for the intake.",
    status: "Needs verification",
    sourceUrl: RP_APPLICATION,
    sourceLabel: "RP official application requirements",
  },
];

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "hec",
    name: "HEC Scholarship Opportunities",
    provider: "Higher Education Council Rwanda",
    coverage: "Varies by published call",
    sourceUrl: HEC_SCHOLARSHIPS,
    sourceLabel: "HEC official scholarship portal",
  },
  {
    id: "rica",
    name: "RICA Scholarship Opportunities",
    provider: "Rwanda Institute for Conservation Agriculture",
    coverage: "Depends on current call",
    sourceUrl: RICA_REQUIREMENTS,
    sourceLabel: "RICA official requirements",
  },
  {
    id: "alu",
    name: "ALU Financial Aid & Scholarships",
    provider: "African Leadership University",
    coverage: "Varies by intake",
    sourceUrl: ALU_FINANCIAL_AID,
    sourceLabel: "ALU official financial aid page",
  },
];

const PATHWAY_OPTIONS: Array<{
  value: Pathway;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    value: "General Education",
    icon: "🎓",
    title: "General Education / A-Level",
    description: "MCB, PCM, MPG, HEG, LFK and other S6 combinations.",
  },
  {
    value: "TSS / TVET",
    icon: "🔧",
    title: "TSS / TVET",
    description:
      "Automobile, Tourism, Software Development, Networking, Electronics and trades.",
  },
  {
    value: "TTC",
    icon: "👩🏾‍🏫",
    title: "TTC",
    description: "Teacher-training pathways such as LE, SSE and SME.",
  },
  {
    value: "Cambridge / International",
    icon: "🌍",
    title: "Cambridge / International",
    description: "IGCSE, AS, A Level, IB and other international qualifications.",
  },
  {
    value: "International / Other",
    icon: "🌐",
    title: "International / Other",
    description: "Another recognised foreign or international curriculum.",
  },
  {
    value: "I'm not sure",
    icon: "❓",
    title: "I'm not sure",
    description: "Let SDE Career Connect help identify your pathway.",
  },
];

const FIELD_OPTIONS: Array<{
  value: Field;
  icon: string;
}> = [
  { value: "Show me everything", icon: "✨" },
  { value: "Technology & ICT", icon: "💻" },
  { value: "Engineering", icon: "⚙️" },
  { value: "Health & Medicine", icon: "🩺" },
  { value: "Agriculture", icon: "🌱" },
  { value: "Business & Economics", icon: "📊" },
  { value: "Education", icon: "🎓" },
  { value: "Social Sciences", icon: "🌍" },
  { value: "Tourism & Hospitality", icon: "✈️" },
  { value: "Creative Arts & Design", icon: "🎨" },
];

function getQualificationPlaceholder(pathway: Pathway) {
  switch (pathway) {
    case "General Education":
      return "e.g. MCB, PCM, LFK, HEG, MEG";
    case "TSS / TVET":
      return "e.g. Automobile Technology, Tourism, Networking";
    case "TTC":
      return "e.g. LE, SSE, SME, ECLPE";
    case "Cambridge / International":
      return "e.g. Cambridge A Level Mathematics, Biology...";
    case "International / Other":
      return "Enter your qualification or programme";
    default:
      return "Enter what you studied";
  }
}

function getQualificationHint(pathway: Pathway) {
  switch (pathway) {
    case "General Education":
      return "Use the combination exactly as shown on your result, such as MCB or LFK.";
    case "TSS / TVET":
      return "Use the trade or programme name on your certificate, such as Automobile Technology.";
    case "TTC":
      return "Use your TTC pathway, such as LE, SSE, SME or ECLPE.";
    case "Cambridge / International":
      return "Enter your qualification and subjects. We will not assume a Rwanda equivalence without evidence.";
    case "International / Other":
      return "Tell us the qualification exactly as it appears on your certificate.";
    default:
      return "If you are unsure, write the qualification as it appears on your certificate.";
  }
}

function detectLikelyPathway(input: string): Pathway | null {
  const value = compact(input);

  if (
    [
      "AUTOMOBILE",
      "AUTOMOBILETECHNOLOGY",
      "AUTOMOTIVETECHNOLOGY",
      "TOURISM",
      "SOFTWAREDEVELOPMENT",
      "NETWORKING",
      "ELECTRONICS",
      "TELECOMMUNICATION",
      "ACCOUNTANCY",
      "CONSTRUCTION",
      "ELECTRICAL",
      "MECHATRONICS",
      "MULTIMEDIA",
      "GRAPHICSARTS",
    ].some((term) => value.includes(term))
  ) {
    return "TSS / TVET";
  }

  if (["LE", "SSE", "SME", "ECLPE"].includes(value)) {
    return "TTC";
  }

  if (
    [
      "MCB",
      "PCB",
      "PCM",
      "MPC",
      "MPG",
      "MCE",
      "MEG",
      "HEG",
      "HGL",
      "HEL",
      "LEG",
      "LFK",
      "LKF",
      "LKK",
      "HLP",
    ].includes(value)
  ) {
    return "General Education";
  }

  return null;
}

function CircularMark({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const safeValue = Math.min(100, Math.max(0, value));
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="finder-score-wrap" ref={ref}>
      <svg
        className="finder-score-svg"
        viewBox="0 0 180 180"
        role="img"
        aria-label={`${safeValue.toFixed(2)} percent overall`}
      >
        <circle
          className="finder-score-track"
          cx="90"
          cy="90"
          r={radius}
        />
        <circle
          className={`finder-score-progress ${
            visible ? "finder-score-progress-visible" : ""
          }`}
          cx="90"
          cy="90"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={visible ? offset : circumference}
        />
      </svg>

      <div className="finder-score-center">
        <strong>{safeValue.toFixed(2)}%</strong>
        <span>OVERALL</span>
      </div>
    </div>
  );
}

function InstitutionBadge({
  institution,
}: {
  institution: Institution;
}) {
  const isUr = institution === "University of Rwanda";

  return (
    <span
      className={`finder-institution-badge ${
        isUr ? "finder-institution-ur" : "finder-institution-rp"
      }`}
    >
      {isUr ? "🎓" : "🛠️"} {isUr ? "UR" : "RP"} · {institution}
    </span>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  const config = {
    "Verified current": {
      icon: "✓",
      className: "finder-status-verified",
      label: "VERIFIED CURRENT",
    },
    "Historical reference": {
      icon: "◷",
      className: "finder-status-history",
      label: "HISTORICAL REFERENCE",
    },
    "Needs verification": {
      icon: "!",
      className: "finder-status-verify",
      label: "NEEDS VERIFICATION",
    },
    "No verified information": {
      icon: "?",
      className: "finder-status-unknown",
      label: "NO VERIFIED INFORMATION",
    },
  }[status];

  return (
    <span className={`finder-status-badge ${config.className}`}>
      <b>{config.icon}</b> {config.label}
    </span>
  );
}

export default function OpportunityFinder() {

  // =========================================================
  // UR — THREE ORDERED PROGRAMME CHOICES
  // =========================================================
  const [urChoices, setUrChoices] =
    React.useState<URThreeChoices>(EMPTY_UR_CHOICES);

  const [showURChoicesReview, setShowURChoicesReview] =
    React.useState(false);

  const [urChoiceToChange, setURChoiceToChange] =
    React.useState<URPreference | null>(null);

  const handleURChoice = (
    preference: URPreference,
    programme: URProgrammeChoice | null,
  ) => {
    setUrChoices((current: URThreeChoices) =>
      setURChoice(current, preference, programme),
    );
  };

  const selectedURChoices =
    urChoices.filter(Boolean) as URProgrammeChoice[];

  const urChoicesComplete =
    areURChoicesComplete(urChoices);

  const urHasDuplicate =
    hasDuplicateURChoices(urChoices);

const [pathway, setPathway] = useState<Pathway>("General Education");
  const [qualification, setQualification] = useState("");
  const [marks, setMarks] = useState("");
  const [field, setField] = useState<Field>("Show me everything");
  const [searched, setSearched] = useState(false);
  const [mobileStep, setMobileStep] = useState(1);

  const numericMarks = Number(marks);

  const likelyPathway = useMemo(
    () => detectLikelyPathway(qualification),
    [qualification],
  );

  const whatsappText = encodeURIComponent(
    `Hello SDE Career Connect. I used the Education Pathway Finder. My pathway is ${pathway}, I studied ${qualification || "not specified"}, and my marks are ${marks || "not specified"}. I need help checking my study options.`,
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  const results = useMemo(() => {
    if (!searched || !qualification.trim()) return [];

    const exact = PROGRAMMES.filter((programme) => {
      if (!programme.pathways.includes(pathway)) return false;

      const exactQualification = isExactQualification(
        qualification,
        programme.acceptedQualifications,
      );

      const aliasMatch = isAliasMatch(
        qualification,
        programme.aliases,
      );

      if (!exactQualification && !aliasMatch) return false;

      if (
        field !== "Show me everything" &&
        programme.field !== field
      ) {
        return false;
      }

      return true;
    });

    return exact;
  }, [field, pathway, qualification, searched]);

  const urResults = results.filter(
    (item) => item.institution === "University of Rwanda",
  );

  const rpResults = results.filter(
    (item) => item.institution === "Rwanda Polytechnic",
  );

  const handleSearch = () => {
    if (!qualification.trim()) {
      setSearched(false);
      return;
    }

    setSearched(true);
    setMobileStep(4);
    window.setTimeout(() => {
      document
        .getElementById("finder-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const reset = () => {
    setQualification("");
    setMarks("");
    setField("Show me everything");
    setSearched(false);
    setMobileStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canCompareMarks =
    Number.isFinite(numericMarks) &&
    numericMarks >= 0 &&
    numericMarks <= 100;

  return (
    <main className="smart-finder-page">
      <section className="smart-finder-hero">
        <div className="smart-finder-container">
          <div className="smart-finder-brand-row">
            <img
              src="/assets/sde-logo-updated.png"
              alt="SDE Career Connect"
              className="smart-finder-logo"
            />

            <div>
              <span className="smart-finder-brand">
                SDE CAREER CONNECT
              </span>
              <span className="smart-finder-powered">
                Powered by STOREROOM DIGITAL EMPIRE
              </span>
            </div>
          </div>

          <div className="smart-finder-hero-grid">
            <div>
              <span className="smart-finder-eyebrow">
                STUDENT OPPORTUNITY FINDER
              </span>

              <h1>
                What can <span>you study?</span>
              </h1>

              <p>
                Tell us how you studied, what you studied and your
                result. We will help you explore programmes at
                <strong> UR and RP</strong>, historical references,
                scholarships and official sources.
              </p>

              <div className="smart-finder-hero-pills">
                <span>✓ UR + RP</span>
                <span>✓ General + TVET</span>
                <span>✓ Official sources</span>
                <span>✓ No guessing</span>
              </div>
            </div>

            <div className="smart-finder-hero-mini">
              <div className="smart-finder-mini-icon">🔎</div>
              <strong>Built around your real qualification</strong>
              <p>
                Your pathway and qualification come first. A broad
                pathway alone will never be treated as proof of
                eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="smart-finder-workspace">
        <div className="smart-finder-container">
          <div className="smart-finder-progress">
            <span className={mobileStep >= 1 ? "active" : ""}>01</span>
            <i />
            <span className={mobileStep >= 2 ? "active" : ""}>02</span>
            <i />
            <span className={mobileStep >= 3 ? "active" : ""}>03</span>
            <i />
            <span className={mobileStep >= 4 ? "active" : ""}>04</span>
          </div>

          <div className="smart-finder-form-card">
            <div className="smart-finder-step">
              <div className="smart-finder-step-number">01</div>
              <div>
                <span className="smart-finder-label">START HERE</span>
                <h2>What type of education did you complete?</h2>
                <p>
                  Choose the option that best describes your
                  secondary education.
                </p>
              </div>
            </div>

            <div className="smart-finder-pathway-grid">
              {PATHWAY_OPTIONS.map((option) => {
                const selected = pathway === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`smart-pathway-card ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => {
                      setPathway(option.value);
                      setSearched(false);
                      setMobileStep(2);
                    }}
                  >
                    <span className="smart-pathway-icon">
                      {option.icon}
                    </span>

                    <span className="smart-pathway-copy">
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                    </span>

                    <span className="smart-pathway-check">
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="smart-finder-divider" />

            <div className="smart-finder-step">
              <div className="smart-finder-step-number">02</div>
              <div>
                <span className="smart-finder-label">
                  YOUR QUALIFICATION
                </span>
                <h2>What exactly did you study?</h2>
                <p>
                  {getQualificationHint(pathway)}
                </p>
              </div>
            </div>

            <div className="smart-input-wrap">
              <input
                value={qualification}
                onChange={(event) => {
                  setQualification(event.target.value);
                  setSearched(false);
                  setMobileStep(2);
                }}
                onFocus={() => setMobileStep(2)}
                placeholder={getQualificationPlaceholder(pathway)}
                className="smart-main-input"
              />

              <span className="smart-input-icon">⌕</span>
            </div>

            {likelyPathway && likelyPathway !== pathway && (
              <div className="smart-detection-warning">
                <span>⚠️</span>
                <div>
                  <strong>
                    This looks like {likelyPathway}.
                  </strong>
                  <p>
                    You selected {pathway}. If that is not correct,
                    switch to the suggested pathway above.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPathway(likelyPathway);
                      setMobileStep(2);
                    }}
                  >
                    Switch to {likelyPathway} →
                  </button>
                </div>
              </div>
            )}

            <div className="smart-finder-divider" />

            <div className="smart-finder-step">
              <div className="smart-finder-step-number">03</div>
              <div>
                <span className="smart-finder-label">YOUR RESULT</span>
                <h2>What was your overall result?</h2>
                <p>
                  Enter a percentage when your qualification uses
                  a comparable percentage scale.
                </p>
              </div>
            </div>

            <div className="smart-marks-row">
              <div className="smart-marks-input">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={marks}
                  onChange={(event) => {
                    setMarks(event.target.value);
                    setSearched(false);
                    setMobileStep(3);
                  }}
                  placeholder="70.51"
                />
                <span>%</span>
              </div>

              <div className="smart-marks-note">
                <strong>Don't have a percentage?</strong>
                <span>
                  Do not invent one. Leave it empty and contact SDE
                  for guidance.
                </span>
              </div>
            </div>

            <div className="smart-finder-divider" />

            <div className="smart-finder-step">
              <div className="smart-finder-step-number">04</div>
              <div>
                <span className="smart-finder-label">YOUR INTEREST</span>
                <h2>What area would you like to explore?</h2>
                <p>
                  Optional. Choose everything if you are still
                  exploring.
                </p>
              </div>
            </div>

            <div className="smart-interest-grid">
              {FIELD_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`smart-interest ${
                    field === option.value ? "selected" : ""
                  }`}
                  onClick={() => setField(option.value)}
                >
                  <span>{option.icon}</span>
                  {option.value}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="smart-find-button"
              onClick={handleSearch}
              disabled={!qualification.trim()}
            >
              <span>FIND MY STUDY OPTIONS</span>
              <b>→</b>
            </button>

            <div className="smart-trust-note">
              <span>💡</span>
              <p>
                This is a guidance tool, not an admission decision.
                We only call something verified when our published
                source supports it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {searched && (
        <section
          className="smart-results"
          id="finder-results"
        >
          <div className="smart-finder-container">
            <div className="smart-profile">
              <div>
                <span className="smart-finder-label">
                  YOUR STUDENT PROFILE
                </span>

                <h2>
                  {qualification.trim()}
                </h2>

                <div className="smart-profile-meta">
                  <span>Pathway: {pathway}</span>
                  {marks && (
                    <span>
                      Marks: {canCompareMarks
                        ? `${numericMarks.toFixed(2)}%`
                        : marks}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="smart-reset"
                onClick={reset}
              >
                ↻ Start again
              </button>
            </div>

            {canCompareMarks && (
              <div className="smart-score-banner">
                <div>
                  <span className="smart-finder-label">
                    YOUR OVERALL RESULT
                  </span>
                  <h2>See your result visually</h2>
                  <p>
                    The green ring is your reported result. It is
                    not a probability of admission.
                  </p>
                </div>

                <CircularMark value={numericMarks} />
              </div>
            )}

            <div className="smart-institution-overview">
              <div>
                <span className="smart-finder-label">
                  EXPLORE BOTH ROUTES
                </span>
                <h2>University of Rwanda + Rwanda Polytechnic</h2>
                <p>
                  Your education pathway does not automatically
                  limit you to one institution. Programme-specific
                  eligibility still has to be checked.
                </p>
              </div>

              <div className="smart-route-counts">
                <span>
                  <b>{urResults.length}</b>
                  <small>UR matches</small>
                </span>
                <span>
                  <b>{rpResults.length}</b>
                  <small>RP matches</small>
                </span>
              </div>
            </div>

            {results.length > 0 ? (
              <>
                <div className="smart-result-section">
                  <div className="smart-result-heading">
                    <div>
                      <span className="smart-finder-label">
                        UNIVERSITY OF RWANDA
                      </span>
                      <h2>UR options</h2>
                    </div>
                    <span className="smart-count">
                      {urResults.length}
                    </span>
                  </div>

                  {urResults.length > 0 ? (
                    <div className="smart-programme-grid">
                      {urResults.map((programme) => (
                        <ProgrammeCard
                          key={programme.id}
                          programme={programme}
                          marks={numericMarks}
                          hasMarks={canCompareMarks}
                          onChooseUR={(preference) =>
                            handleURChoice(preference, {
                              preference,
                              programmeId: programme.id,
                              programmeName: programme.programme,
                              programmeCode: programme.id,
                            })
                          }
                          selectedURChoices={urChoices}
                        />
                      ))}
                    </div>
                  ) : (
                    <InstitutionEmpty
                      institution="University of Rwanda"
                      sourceUrl={UR_ENTRY_REQUIREMENTS}
                    />
                  )}
                </div>

                <div className="smart-result-section">
                  <div className="smart-result-heading">
                    <div>
                      <span className="smart-finder-label">
                        RWANDA POLYTECHNIC
                      </span>
                      <h2>RP options</h2>
                    </div>
                    <span className="smart-count">
                      {rpResults.length}
                    </span>
                  </div>

                  {rpResults.length > 0 ? (
                    <div className="smart-programme-grid">
                      {rpResults.map((programme) => (
                        <ProgrammeCard
                          key={programme.id}
                          programme={programme}
                          marks={numericMarks}
                          hasMarks={canCompareMarks}
                        />
                      ))}
                    </div>
                  ) : (
                    <InstitutionEmpty
                      institution="Rwanda Polytechnic"
                      sourceUrl={RP_PROGRAMMES}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="smart-no-match">
                <div className="smart-no-match-icon">🔎</div>
                <span className="smart-finder-label">
                  NO VERIFIED DIRECT MATCH FOUND
                </span>
                <h2>We don't want to guess.</h2>
                <p>
                  We currently do not have verified programme
                  information connecting <strong>{qualification}</strong>{" "}
                  with your selected pathway and field.
                </p>
                <p>
                  This does <strong>not</strong> mean you cannot
                  study. It means our current reference data is not
                  sufficient to tell you that confidently.
                </p>

                <div className="smart-no-match-actions">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="smart-help-button"
                  >
                    💬 ASK SDE TO VERIFY
                  </a>

                  <a
                    href={WHATSAPP_GROUP}
                    target="_blank"
                    rel="noreferrer"
                    className="smart-secondary-button"
                  >
                    JOIN SDE WHATSAPP
                  </a>
                </div>
              </div>
            )}

            <section className="smart-scholarships">
              <div className="smart-result-heading">
                <div>
                  <span className="smart-finder-label">
                    FUNDING
                  </span>
                  <h2>Scholarships to check</h2>
                </div>
              </div>

              <p className="smart-section-intro">
                Scholarship calls change. We show official starting
                points rather than promising that a student is
                currently eligible.
              </p>

              <div className="smart-scholarship-grid">
                {SCHOLARSHIPS.map((scholarship) => (
                  <a
                    key={scholarship.id}
                    href={scholarship.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="smart-scholarship-card"
                  >
                    <span>💰</span>
                    <div>
                      <small>{scholarship.provider}</small>
                      <strong>{scholarship.name}</strong>
                      <p>{scholarship.coverage}</p>
                      <b>Open official source ↗</b>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="smart-register">
              <div className="smart-register-copy">
                <span className="smart-finder-label">
                  NEED MORE THAN A SEARCH?
                </span>
                <h2>Register with SDE Career Connect</h2>
                <p>
                  If your qualification is missing, your pathway is
                  unusual, or you want someone to review your options,
                  ask SDE Career Connect to verify them with you.
                </p>
                <strong>
                  We will tell you when information is unavailable
                  instead of inventing an answer.
                </strong>
              </div>

              <div className="smart-register-actions">
                <a
                  href="/?register=1"
                  className="smart-register-button"
                >
                  REGISTER NOW →
                </a>

                <a
                  href={WHATSAPP_GROUP}
                  target="_blank"
                  rel="noreferrer"
                  className="smart-group-button"
                >
                  Join WhatsApp Group
                </a>
              </div>
            </section>

            <section className="smart-warning">
              <span>⚠️</span>
              <div>
                <strong>
                  Important: guidance, not an admission decision
                </strong>
                <p>
                  Requirements, programmes, application procedures
                  and competition can change. Historical marks are
                  references from previous cycles, not guarantees.
                  Always verify the current official source before
                  applying.
                </p>
              </div>
            </section>

            <section className="smart-sources">
              <span className="smart-finder-label">
                OFFICIAL SOURCES
              </span>
              <h2>Start your verification here.</h2>

              <div className="smart-source-links">
                <a
                  href={UR_ENTRY_REQUIREMENTS}
                  target="_blank"
                  rel="noreferrer"
                >
                  University of Rwanda — Entry Requirements ↗
                </a>
                <a
                  href={UR_ADMISSION_CRITERIA}
                  target="_blank"
                  rel="noreferrer"
                >
                  University of Rwanda — Admission Criteria ↗
                </a>
                <a
                  href={RP_PROGRAMMES}
                  target="_blank"
                  rel="noreferrer"
                >
                  Rwanda Polytechnic — Programmes ↗
                </a>
                <a
                  href={RP_APPLICATION}
                  target="_blank"
                  rel="noreferrer"
                >
                  Rwanda Polytechnic — Application Requirements ↗
                </a>
              </div>
            </section>
          </div>
        </section>
      )}

      <footer className="smart-finder-footer">
        <div className="smart-finder-container">
          <img
            src="/assets/sde-logo-updated.png"
            alt="SDE Career Connect"
            className="smart-footer-logo"
          />

          <div>
            <strong>SDE CAREER CONNECT</strong>
            <span>
              Student support · Scholarships · University guidance
            </span>
          </div>

          <span className="smart-footer-powered">
            Powered by STOREROOM DIGITAL EMPIRE
          </span>
        </div>
      </footer>

        <section className="ur-three-choice-panel">
          <div className="ur-three-choice-heading">
            <div>
              <span className="ur-three-choice-kicker">
                UR APPLICATION
              </span>

              <h2>Choose Your 3 Programme Preferences</h2>

              <p>
                Select three different programmes and arrange them
                in the order you want them considered.
              </p>
            </div>

            <div className="ur-choice-counter">
              <strong>{selectedURChoices.length}</strong>
              <span>/ 3 choices</span>
            </div>
          </div>

          <div className="ur-choice-grid">
            {[1, 2, 3].map((number) => {
              const preference = number as URPreference;
              const selected = urChoices[preference - 1];

              return (
                <article
                  className={`ur-choice-card ur-choice-${number}`}
                  key={number}
                >
                  <div className="ur-choice-number">
                    {number === 1
                      ? "🥇"
                      : number === 2
                        ? "🥈"
                        : "🥉"}
                  </div>

                  <div className="ur-choice-card-content">
                    <span className="ur-choice-label">
                      CHOICE {number}
                    </span>

                    <h3>
                      {selected?.programmeName ||
                        "No programme selected"}
                    </h3>

                    {selected?.programmeCode && (
                      <span className="ur-choice-code">
                        {selected.programmeCode}
                      </span>
                    )}

                    <div className="ur-choice-status">
                      {selected
                        ? "✓ Programme selected"
                        : "Choose a programme from your results"}
                    </div>

                    {selected && (
                      <button
                        type="button"
                        className="ur-choice-remove"
                        onClick={() =>
                          handleURChoice(preference, null)
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {urHasDuplicate && (
            <div className="ur-choice-warning">
              ⚠️ Each programme can only be selected once.
            </div>
          )}

          <div className="ur-choice-footer">
            <div>
              <strong>Your order matters.</strong>
              <span>
                Choice 1 = first preference · Choice 2 = second
                preference · Choice 3 = third preference
              </span>
            </div>

            <button
              type="button"
              className="ur-choice-review-button"
              disabled={!urChoicesComplete || urHasDuplicate}
              onClick={() => {
                setShowURChoicesReview(true);
                setURChoiceToChange(null);
              }}
            >
              REVIEW MY 3 CHOICES →
            </button>
          </div>
        </section>

        {showURChoicesReview && (
          <div
            className="ur-review-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ur-review-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setShowURChoicesReview(false);
              }
            }}
          >
            <section className="ur-review-modal">
              <button
                type="button"
                className="ur-review-close"
                aria-label="Close review"
                onClick={() => setShowURChoicesReview(false)}
              >
                ×
              </button>

              <div className="ur-review-header">
                <span className="ur-review-kicker">
                  UR ADMISSION PLANNER
                </span>

                <h2 id="ur-review-title">
                  Review Your 3 Programme Choices
                </h2>

                <p>
                  Check your order carefully before confirming your
                  preferences. Choice 1 is your first preference.
                </p>
              </div>

              <div className="ur-review-list">
                {urChoices.map((choice, index) => {
                  const preference = (index + 1) as URPreference;

                  return (
                    <article
                      key={preference}
                      className={`ur-review-choice ur-review-choice-${preference}`}
                    >
                      <div className="ur-review-choice-number">
                        {preference === 1
                          ? "🥇"
                          : preference === 2
                            ? "🥈"
                            : "🥉"}
                      </div>

                      <div className="ur-review-choice-content">
                        <span className="ur-review-choice-label">
                          CHOICE {preference}
                        </span>

                        {choice ? (
                          <>
                            <h3>{choice.programmeName}</h3>

                            {choice.programmeCode && (
                              <span className="ur-review-code">
                                {choice.programmeCode}
                              </span>
                            )}
                          </>
                        ) : (
                          <h3 className="ur-review-empty">
                            No programme selected
                          </h3>
                        )}
                      </div>

                      <div className="ur-review-choice-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setURChoiceToChange(preference);
                            setShowURChoicesReview(false);
                          }}
                        >
                          CHANGE
                        </button>

                        {choice && (
                          <button
                            type="button"
                            className="ur-review-remove"
                            onClick={() => {
                              handleURChoice(preference, null);
                            }}
                          >
                            REMOVE
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {urChoiceToChange && (
                <div className="ur-review-change-notice">
                  <strong>
                    Choice {urChoiceToChange} is ready to change.
                  </strong>
                  <span>
                    Return to the programme list and choose a different
                    programme for this preference.
                  </span>
                </div>
              )}

              <div className="ur-review-footer">
                <button
                  type="button"
                  className="ur-review-secondary"
                  onClick={() => setShowURChoicesReview(false)}
                >
                  ← EDIT CHOICES
                </button>

                <button
                  type="button"
                  className="ur-review-confirm"
                  disabled={!urChoicesComplete || urHasDuplicate}
                  onClick={() => {
                    const choices = urChoices.map((choice) =>
                      choice
                        ? {
                            programmeId: choice.programmeId,
                            programmeName: choice.programmeName,
                            programmeCode: choice.programmeCode || "",
                          }
                        : null,
                    );

                    sessionStorage.setItem(
                      "sde:confirmed-ur-choices",
                      JSON.stringify(choices),
                    );

                    sessionStorage.setItem(
                      "sde:open-application-support",
                      "UR",
                    );

                    window.location.href = "/?applicationSupport=1";
                  }}
                >
                  CONFIRM 3 CHOICES ✓
                </button>
              </div>
            </section>
          </div>
        )}

        </main>
  );
}

function ProgrammeCard({
  programme,
  marks,
  hasMarks,
  onChooseUR,
  selectedURChoices = EMPTY_UR_CHOICES,
}: {
  programme: Programme;
  marks: number;
  hasMarks: boolean;
  onChooseUR?: (preference: URPreference) => void;
  selectedURChoices?: URThreeChoices;
}) {
  const hasHistorical =
    typeof programme.historicalCutoff === "number";

  const comparison =
    hasMarks && hasHistorical
      ? marks >= programme.historicalCutoff!
        ? "above"
        : "below"
      : null;

  const selectedPreference = selectedURChoices.find(
    (choice) => choice?.programmeId === programme.id,
  )?.preference;

  const selectedInAnotherChoice =
    Boolean(selectedPreference);

  const availablePreferences = ([1, 2, 3] as URPreference[]).filter(
    (preference) =>
      !selectedURChoices[preference - 1],
  );

  return (
    <article
      className={`smart-programme-card ${
        selectedInAnotherChoice
          ? "ur-programme-selected"
          : ""
      }`}
    >
      <div className="smart-card-top">
        <InstitutionBadge institution={programme.institution} />
        <StatusBadge status={programme.status} />
      </div>

      {selectedPreference && (
        <div className="ur-selected-ribbon">
          {selectedPreference === 1
            ? "🥇"
            : selectedPreference === 2
              ? "🥈"
              : "🥉"}{" "}
          CHOICE {selectedPreference}
        </div>
      )}

      <h3>{programme.programme}</h3>

      <div className="smart-card-field">
        <span>FIELD</span>
        <strong>{programme.field}</strong>
      </div>

      <div className="smart-card-qualification">
        <span>YOUR QUALIFICATION</span>
        <strong>
          {programme.acceptedQualifications.join(" · ")}
        </strong>
      </div>

      <div className="smart-guidance-box">
        <span>Current guidance</span>
        <p>{programme.currentGuidance}</p>
      </div>

      {hasHistorical ? (
        <div
          className={`smart-cutoff ${
            comparison === "above"
              ? "above"
              : comparison === "below"
                ? "below"
                : ""
          }`}
        >
          <div>
            <span>HISTORICAL REFERENCE</span>
            <strong>{programme.historicalCutoff}%</strong>
          </div>

          {hasMarks && (
            <div className="smart-cutoff-compare">
              <span>YOUR RESULT</span>
              <strong>{marks.toFixed(2)}%</strong>
            </div>
          )}

          <p>
            {programme.historicalNote ||
              `Reference from ${
                programme.historicalYear ||
                "a previous admission cycle"
              }.`}
          </p>

          {comparison === "above" && (
            <b className="smart-compare-positive">
              Your result is above this historical reference.
            </b>
          )}

          {comparison === "below" && (
            <b className="smart-compare-warning">
              Your result is below this historical reference.
            </b>
          )}
        </div>
      ) : (
        <div className="smart-no-cutoff">
          <span>HISTORICAL CUT-OFF</span>
          <strong>No verified reference stored</strong>
          <p>
            This does not mean you cannot apply. We simply do not
            have a verified historical figure to display.
          </p>
        </div>
      )}

      <div className="ur-programme-choice-actions">
        <div className="ur-programme-choice-title">
          <span>ADD TO YOUR 3 UR CHOICES</span>
          {selectedInAnotherChoice && (
            <strong>✓ Selected</strong>
          )}
        </div>

        {selectedInAnotherChoice ? (
          <div className="ur-programme-selected-message">
            {selectedPreference === 1
              ? "🥇 First preference"
              : selectedPreference === 2
                ? "🥈 Second preference"
                : "🥉 Third preference"}

            <button
              type="button"
              onClick={() =>
                onChooseUR?.(selectedPreference as URPreference)
              }
            >
              KEEP THIS CHOICE
            </button>
          </div>
        ) : (
          <div className="ur-choice-button-grid">
            {([1, 2, 3] as URPreference[]).map(
              (preference) => {
                const alreadyFilled =
                  Boolean(
                    selectedURChoices[
                      preference - 1
                    ],
                  );

                return (
                  <button
                    key={preference}
                    type="button"
                    className={`ur-add-choice-button choice-${preference}`}
                    disabled={alreadyFilled}
                    onClick={() =>
                      onChooseUR?.(preference)
                    }
                  >
                    {preference === 1
                      ? "🥇 CHOICE 1"
                      : preference === 2
                        ? "🥈 CHOICE 2"
                        : "🥉 CHOICE 3"}
                  </button>
                );
              },
            )}
          </div>
        )}

        {!selectedInAnotherChoice &&
          availablePreferences.length === 0 && (
            <small className="ur-three-choice-full">
              All 3 choices are already selected. Change one
              above to select this programme.
            </small>
          )}
      </div>

      <a
        href={programme.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="smart-source-button"
      >
        VIEW OFFICIAL SOURCE ↗
      </a>

      <small className="smart-source-label">
        Source: {programme.sourceLabel}
      </small>
    </article>
  );
}

function InstitutionEmpty({
  institution,
  sourceUrl,
}: {
  institution: Institution;
  sourceUrl: string;
}) {
return (
    <div className="smart-institution-empty">
      <span>ℹ️</span>
      <div>
        <strong>No verified direct option found in our current data.</strong>
        <p>
          This does not mean you are rejected. We may simply not
          have enough programme-specific information for your
          qualification yet.
        </p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Check {institution} official information ↗
        </a>
      </div>
    </div>
  );
}
