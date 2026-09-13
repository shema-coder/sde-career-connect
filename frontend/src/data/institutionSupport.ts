export type InstitutionKey = "UR" | "RP" | "ALU";

export type InstitutionSupportInfo = {
  key: InstitutionKey;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  accent: string;
  applicationType: string;
  requirements: string[];
  documents: string[];
  important: string[];
  choices: string[];
  scholarship: string[];
  supportNote: string;
};

export const institutionSupportInfo: Record<
  InstitutionKey,
  InstitutionSupportInfo
> = {
  UR: {
    key: "UR",
    name: "University of Rwanda",
    shortName: "UR",
    eyebrow: "PUBLIC UNIVERSITY • RWANDA",
    description:
      "Choose your programme carefully. UR admission requirements can change by programme, college, combination and trade.",
    accent: "#174ea6",
    applicationType: "Undergraduate admission",
    requirements: [
      "Advanced Level Certificate, TVET Certificate or an equivalent qualification.",
      "At least two relevant principal passes permitting entry to higher education.",
      "Programme-specific requirements may require particular combinations, subjects, trades or cut-off marks.",
      "Applicants should verify the exact programme combination before submitting their choices.",
    ],
    documents: [
      "National ID",
      "S6 result / certificate or equivalent qualification",
      "Index number",
      "Passport-size photograph",
      "Equivalence documents where applicable",
    ],
    important: [
      "UR allows applicants to make programme choices through its official application process.",
      "Programme eligibility is not identical across all UR programmes.",
      "The 2026–2027 undergraduate call used programme-specific cut-off marks and required combinations.",
    ],
    choices: [
      "Choice 1 — preferred programme",
      "Choice 2 — alternative programme",
      "Choice 3 — alternative programme",
    ],
    scholarship: [
      "Ask SDE about HEC/BRD higher-education financing and other available funding opportunities.",
      "Scholarship or financing eligibility can depend on the current funding scheme and applicant circumstances.",
    ],
    supportNote:
      "If you do not know which UR programmes match your combination or trade, SDE can help you identify suitable options.",
  },

  RP: {
    key: "RP",
    name: "Rwanda Polytechnic",
    shortName: "RP",
    eyebrow: "TECHNICAL & VOCATIONAL EDUCATION",
    description:
      "RP admission is strongly connected to your previous qualification, relevant subjects/modules and the programme you want to study.",
    accent: "#087f5b",
    applicationType: "Technical & professional admission",
    requirements: [
      "Completed Senior 6 for General Education applicants.",
      "Completed Level 5 TVET with a completion certificate for TVET applicants.",
      "At least two relevant principal passes in subjects/modules related to the chosen RP programme.",
      "International qualifications require an equivalence from the competent authority.",
      "Advanced Diploma holders applying for BTech use academic transcripts and certificates/degrees instead of S6/Level 5 certificates.",
    ],
    documents: [
      "National ID or valid passport",
      "S6 certificate/result or Level 5 certificate",
      "Index/registration number where applicable",
      "Passport-size photograph",
      "Academic transcripts for Advanced Diploma/BTech applicants",
    ],
    important: [
      "Your previous trade or academic background matters when selecting an RP programme.",
      "Not every RP programme accepts every combination or trade.",
      "The relevant college/programme requirements should be checked before making final choices.",
    ],
    choices: [
      "Choice 1 — preferred RP programme",
      "Choice 2 — alternative RP programme",
      "Choice 3 — alternative RP programme",
    ],
    scholarship: [
      "SDE can help you understand available study-financing and scholarship opportunities.",
      "Funding conditions should be checked against the current programme and funding scheme.",
    ],
    supportNote:
      "If you are unsure which RP programme matches your trade, tell us your trade and we will help you identify suitable options.",
  },

  ALU: {
    key: "ALU",
    name: "African Leadership University",
    shortName: "ALU",
    eyebrow: "PAN-AFRICAN UNIVERSITY • KIGALI",
    description:
      "ALU uses programme-specific admission criteria and places strong emphasis on English proficiency, academic readiness and student potential.",
    accent: "#6d28d9",
    applicationType: "Undergraduate admission + optional financial aid",
    requirements: [
      "Completed secondary education at A-Level or an equivalent qualification.",
      "Meet applicable Rwandan equivalence requirements for foreign qualifications.",
      "Demonstrate English proficiency at CEFR B2 or an accepted equivalent.",
      "Programme-specific academic requirements may apply.",
      "Some programmes have direct and indirect admission routes.",
    ],
    documents: [
      "Secondary school certificate/result",
      "National ID or passport",
      "Equivalence certificate where applicable",
      "English proficiency evidence",
      "Additional programme-specific documents where required",
    ],
    important: [
      "English is the language of instruction and applicants need appropriate English proficiency.",
      "ALU programme requirements are not identical across all degrees.",
      "For example, Software Engineering and International Business & Trade have additional programme-specific criteria.",
    ],
    choices: [
      "Programme 1 — preferred ALU programme",
      "Programme 2 — alternative programme",
      "Programme 3 — alternative programme",
    ],
    scholarship: [
      "ALU has financial-aid and scholarship pathways in addition to normal admission.",
      "Financial aid may require a financial calculator, household financial information and supporting documents.",
      "Scholarship opportunities can include Mastercard Foundation pathways and ALU grants, subject to eligibility and available places.",
    ],
    supportNote:
      "If you need scholarship or financial-aid support, SDE can help you understand which information and documents you should prepare.",
  },
};
