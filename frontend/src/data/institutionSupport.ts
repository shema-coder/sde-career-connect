export type InstitutionKey =
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

export type VerificationStatus =
  | "VERIFIED_OFFICIAL"
  | "VERIFIED_WITH_PROGRAMME_CHECK"
  | "GENERAL_GUIDANCE_ONLY";

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

  officialWebsite?: string;
  officialApplicationUrl?: string;
  sourceUrl?: string;

  verificationStatus: VerificationStatus;
  lastVerified: string;
};

export const HEC_2026_2027_NOTICE = {
  title:
    "HEC Public Notice — Admission Requirements for Undergraduate Programmes",
  date: "17 September 2026",
  academicYear: "2026–2027",
  rules: [
    "For September 2026 admissions, applicants who completed secondary education in Rwanda must hold an Advanced Certificate of Secondary Education.",
    "Applicants who completed secondary education outside Rwanda must present an equivalent qualification.",
    "Secondary education certificates obtained by 2024 under the previous Two Principal Passes entry system remain acceptable during the one-year 2026–2027 transition period.",
    "Applicants using the transition provision must obtain NESA results confirmation showing their marks under the current grading system.",
    "Programme-specific requirements, subject combinations, trades, tests, interviews and institutional rules may still apply.",
  ],
  sourceUrl: "https://www.hec.gov.rw/",
};

const HEC_BASELINE = [
  "2026–2027 HEC baseline: Rwanda secondary-school graduates should hold the Advanced Certificate of Secondary Education.",
  "Applicants who completed secondary education outside Rwanda should present an equivalent qualification.",
  "Certificates obtained by 2024 under the former Two Principal Passes system remain acceptable during the one-year 2026–2027 transition.",
  "Where the transition provision applies, the applicant should obtain NESA results confirmation showing marks under the current grading system.",
  "Meeting the national baseline does not automatically guarantee admission to a specific programme. Programme-specific academic, subject, trade, test or selection requirements may still apply.",
];

export const institutionSupportInfo: Partial<
  Record<InstitutionKey, InstitutionSupportInfo>
> = {
  UR: {
    key: "UR",
    name: "University of Rwanda",
    shortName: "UR",
    eyebrow: "PUBLIC UNIVERSITY • RWANDA",
    description:
      "UR uses programme-specific admission criteria. Your academic qualification, combination or TVET trade, principal subjects, marks and the programme you select all matter.",
    accent: "#174ea6",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "UR's 2026–2027 undergraduate call contains programme-specific minimum entry requirements, cut-off marks, principal subject passes and required combinations or TVET trades.",
      "UR's current 2026–2027 call linked 109 undergraduate programmes.",
      "The official 2026–2027 UR call allowed applicants to make up to five programme choices. SDE's three-choice planner is a preparation tool and should not be confused with the official UR submission limit.",
      "Your programme eligibility must be checked against the exact UR programme, combination/trade and current admission criteria.",
      "Some programmes use additional requirements such as minimum grades in particular principal subjects, raw NESA marks, admission tests or interviews.",
      "Applicants with foreign qualifications must follow the applicable equivalence route.",
    ],
    documents: [
      "Advanced Certificate of Secondary Education or applicable equivalent.",
      "NESA index number/result information where applicable.",
      "National ID for Rwandan applicants.",
      "Passport for international applicants where applicable.",
      "Passport-size photograph where requested by the application route.",
      "NESA results confirmation for applicants using the 2026–2027 transition provision for certificates obtained by 2024.",
      "Equivalence documentation for foreign qualifications where applicable.",
      "Additional programme-specific documents where required.",
    ],
    important: [
      "UR's 2026–2027 application call opened on 27 July 2026 and closed on 30 August 2026.",
      "The official call defines cut-off marks and programme-specific combinations/trades.",
      "Historical cut-off marks must never be presented as guaranteed current admission marks.",
      "UR programme eligibility should be checked using the official programme requirements before the student submits an application.",
      "SDE should distinguish current requirements from historical admission data.",
    ],
    choices: [
      "SDE Choice 1 — first/preferred programme",
      "SDE Choice 2 — second/preferred alternative",
      "SDE Choice 3 — third/preferred alternative",
      "The order matters for SDE planning.",
      "The official UR application system may use a different number of choices; always follow the current official call when submitting.",
    ],
    scholarship: [
      "SDE can help students understand available higher-education financing and scholarship pathways.",
      "HEC/BRD financing conditions depend on the current financing scheme and applicant eligibility.",
      "External scholarships may have separate deadlines and documentation.",
      "A student should not assume that being eligible for UR automatically means being eligible for a scholarship or loan.",
    ],
    supportNote:
      "For UR, SDE can help compare your qualification, combination/trade, marks and programme choices before you use the official UR application system.",
    officialWebsite: "https://www.ur.ac.rw/",
    officialApplicationUrl: "https://applications.ur.ac.rw/",
    sourceUrl:
      "https://studentrak.ur.ac.rw/calls/746b33fc-36b3-48b0-b252-cb327171e1d3",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  RP: {
    key: "RP",
    name: "Rwanda Polytechnic",
    shortName: "RP",
    eyebrow: "PUBLIC TECHNICAL & PROFESSIONAL EDUCATION",
    description:
      "RP is strongly connected to the applicant's previous academic or TVET background, relevant subjects/modules and the technical programme selected.",
    accent: "#087f5b",
    applicationType: "Technical & professional admission",
    requirements: [
      ...HEC_BASELINE,
      "RP's current admissions guidance states that applicants from General Education normally present Senior 6 qualifications, while TVET applicants may enter with Level 5 and a completion certificate.",
      "RP's current online application guidance states that applicants should have relevant principal passes in core modules/subjects related to the programme.",
      "For Advanced Diploma holders applying to Bachelor of Technology programmes, RP requests academic transcripts and certificates/degrees instead of the Senior 6/Level 5 certificate route.",
      "International qualifications require an equivalence from a competent Rwandan authority; RP currently directs applicants toward NESA for equivalence.",
      "Programme-specific eligibility depends on the applicant's combination, trade and the RP programme selected.",
      "Because the HEC 17 September 2026 notice establishes the national 2026–2027 transition, SDE must check the current RP application instructions against that HEC framework rather than relying only on older Two Principal Pass wording.",
    ],
    documents: [
      "Advanced Certificate of Secondary Education for the applicable General Education route.",
      "Level 5 completion certificate for applicable TVET applicants.",
      "NESA results/index information where applicable.",
      "National ID for Rwandan applicants.",
      "Valid passport for international applicants.",
      "Recent passport-size photograph.",
      "Academic transcripts and certificates/degrees for Advanced Diploma holders applying to BTech.",
      "Equivalence certificate for foreign qualifications.",
      "Registration/payment evidence when required by RP.",
    ],
    important: [
      "RP's official admissions page currently lists completed Senior 6, relevant principal passes, National ID/passport and an accessible email/password among its admission requirements.",
      "RP's online application guidance distinguishes General Education, TVET Level 5 and Advanced Diploma/BTech applicants.",
      "RP programme eligibility is not identical across all programmes.",
      "A student's previous trade or subject combination can determine which technical programmes are appropriate.",
      "Historical programme-combination documents should be checked against the current RP call before being treated as current.",
    ],
    choices: [
      "SDE Choice 1 — preferred RP programme",
      "SDE Choice 2 — alternative RP programme",
      "SDE Choice 3 — alternative RP programme",
      "The SDE choices are for planning and support; the official RP application should follow the current RP portal rules.",
    ],
    scholarship: [
      "SDE can help identify current scholarship and student-financing opportunities relevant to RP applicants.",
      "Funding may depend on programme, academic performance, financial circumstances and the specific sponsor.",
      "Do not treat a scholarship opportunity as guaranteed until the sponsor or institution confirms eligibility.",
    ],
    supportNote:
      "For RP, SDE can help match your General Education combination or TVET trade with appropriate programmes and identify the documents and route you should prepare.",
    officialWebsite: "https://www.rp.ac.rw/",
    officialApplicationUrl: "https://new.rp.ac.rw/online-application/",
    sourceUrl: "https://web.rp.ac.rw/admissions",
    verificationStatus: "VERIFIED_WITH_PROGRAMME_CHECK",
    lastVerified: "2026-09-17",
  },

  ALU: {
    key: "ALU",
    name: "African Leadership University",
    shortName: "ALU",
    eyebrow: "PAN-AFRICAN UNIVERSITY • KIGALI",
    description:
      "ALU has programme-specific undergraduate requirements and places particular emphasis on academic preparation and English proficiency.",
    accent: "#6d28d9",
    applicationType: "Undergraduate admission + financial aid",
    requirements: [
      "Completed final secondary education at A-Level or equivalent.",
      "Foreign qualifications require the applicable Rwandan equivalence process.",
      "ALU requires English proficiency at CEFR B2 or an accepted equivalent for an unconditional offer.",
      "BSc Entrepreneurial Leadership: current ALU guidance requires the general qualification and English requirements plus programme-specific academic criteria.",
      "BSc Software Engineering Direct Route: current guidance includes at least 60% in Mathematics or a computer-related subject.",
      "BSc Software Engineering Indirect Route: current guidance includes at least 65% in Biology, Physics or Chemistry plus a 60% pass in ALU's internal Mathematics test.",
      "BSc International Business & Trade Direct Route: current guidance includes at least 60% in Mathematics at Advanced or O-Level.",
      "IBT Indirect Route has additional programme-related subject and internal Mathematics requirements.",
    ],
    documents: [
      "Final national secondary examination certificate or equivalent.",
      "Secondary school transcripts for Grades 10–12.",
      "Valid National ID, passport or accepted identification document.",
      "English proficiency evidence.",
      "Equivalence certificate where applicable.",
      "Additional programme-specific evidence where requested.",
    ],
    important: [
      "ALU's admissions guidance says applications are reviewed on a rolling basis, subject to intake capacity and deadlines.",
      "ALU publishes programme-specific eligibility requirements for Entrepreneurial Leadership, Software Engineering and International Business & Trade.",
      "ALU warns applicants not to pay agents or individuals claiming they can submit an ALU application on their behalf.",
    ],
    choices: [
      "Programme 1 — preferred ALU programme",
      "Programme 2 — alternative ALU programme",
      "Programme 3 — alternative ALU programme",
    ],
    scholarship: [
      "ALU has financial-aid and scholarship pathways.",
      "Financial-aid applicants may need to provide financial information and supporting documentation.",
      "Specific scholarship availability, deadlines and eligibility should be checked in the current ALU admissions/financial-aid portal.",
    ],
    supportNote:
      "SDE can help you understand ALU programme requirements, prepare documents and identify questions to check before submitting your ALU application.",
    officialWebsite: "https://www.alueducation.com/",
    officialApplicationUrl: "https://www.alueducation.com/apply-now/",
    sourceUrl:
      "https://help.alueducation.com/support/solutions/articles/204000012898-what-are-the-minimum-eligibility-requirements-to-study-at-alu-",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  UOK: {
    key: "UOK",
    name: "University of Kigali",
    shortName: "UoK",
    eyebrow: "PRIVATE UNIVERSITY • KIGALI",
    description:
      "UoK offers undergraduate programmes across business, computing and IT, education and law, with programme-specific requirements.",
    accent: "#0f766e",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "UoK's current undergraduate admissions page lists at least two principal passes at A-Level or equivalent for its freshman admission route.",
      "Applicants should demonstrate at least a basic level of English proficiency.",
      "Foreign Senior Six qualifications require the applicable equivalence certificate.",
      "Programme-specific requirements may vary.",
    ],
    documents: [
      "Notarised Senior Six certificate or equivalent.",
      "Equivalence certificate where applicable.",
      "National ID or passport.",
      "Two passport-size photographs.",
      "Medical insurance evidence where required.",
      "Previous institution transcript for transfer applicants.",
    ],
    important: [
      "UoK currently advertises undergraduate programmes in business, computing/IT, education and law.",
      "UoK operates Kigali, Remera and Musanze campuses.",
      "The current UoK website advertises September 2026 undergraduate intake.",
      "Confirm programme-specific requirements and current fees before application.",
    ],
    choices: [
      "Choice 1 — preferred UoK programme",
      "Choice 2 — alternative UoK programme",
      "Choice 3 — alternative UoK programme",
    ],
    scholarship: [
      "Check UoK's current admissions and finance information for available payment or support options.",
      "SDE can help compare programme costs and identify external scholarship opportunities.",
    ],
    supportNote:
      "SDE can help you compare UoK programmes, prepare the required documents and understand the application process.",
    officialWebsite: "https://uok.ac.rw/",
    officialApplicationUrl: "https://admissions.uok.ac.rw/",
    sourceUrl: "https://uok.ac.rw/admission-requirements/",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  AUCA: {
    key: "AUCA",
    name: "Adventist University of Central Africa",
    shortName: "AUCA",
    eyebrow: "PRIVATE UNIVERSITY • KIGALI",
    description:
      "AUCA undergraduate applications require academic documents, identification and programme-specific evidence. Health programmes have additional subject requirements.",
    accent: "#2563eb",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "AUCA's current undergraduate admissions page requires a completed online application.",
      "Applicants should provide certified academic qualifications and S4, S5 and S6 reports/transcripts.",
      "Applicants need identification and a recent coloured passport photograph.",
      "Medical insurance proof is listed among current application requirements.",
      "Nursing applicants currently need at least C in Biology and Chemistry and D in Mathematics or Physics, subject to the applicable programme route.",
      "Foreign academic qualifications require NESA equivalence.",
    ],
    documents: [
      "Certified diploma/certificate.",
      "S4, S5 and S6 reports/transcripts.",
      "Coloured passport photo.",
      "National ID or passport.",
      "Medical insurance proof.",
      "Application-fee payment receipt where applicable.",
      "NESA equivalence for foreign qualifications.",
    ],
    important: [
      "AUCA's current admissions page states that undergraduate applications are open.",
      "Programme-specific requirements should be checked before applying.",
      "Nursing and other health programmes can have additional academic requirements.",
    ],
    choices: [
      "Choice 1 — preferred AUCA programme",
      "Choice 2 — alternative AUCA programme",
      "Choice 3 — alternative AUCA programme",
    ],
    scholarship: [
      "Check the current AUCA admissions and financial-support announcements.",
      "SDE can help students identify external scholarship opportunities and prepare scholarship documents.",
    ],
    supportNote:
      "SDE can help prepare AUCA academic documents and check whether your intended programme has additional requirements.",
    officialWebsite: "https://www.auca.ac.rw/",
    officialApplicationUrl: "https://web.auca.ac.rw/admissions/undergraduate-requirements",
    sourceUrl:
      "https://web.auca.ac.rw/admissions/undergraduate-requirements",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  ULK: {
    key: "ULK",
    name: "University of Lay Adventists of Kigali",
    shortName: "ULK",
    eyebrow: "PRIVATE UNIVERSITY • RWANDA",
    description:
      "ULK requires recognised secondary qualifications and registration documents, with programme-specific admission requirements applying where relevant.",
    accent: "#7c3aed",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "ULK's current undergraduate admission guidance requires compliance with applicable national admission requirements or equivalence for foreign qualifications.",
      "Programme-specific requirements should be checked before registration.",
    ],
    documents: [
      "Notified copy of the required secondary certificate.",
      "Completed registration/application form.",
      "Passport photographs.",
      "National ID or equivalent identification.",
      "Proof of registration-fee payment.",
      "Equivalence documentation where applicable.",
    ],
    important: [
      "ULK's published undergraduate admission page states that applicants must comply with Ministry of Education admission requirements or foreign equivalence requirements.",
      "The institution may require additional programme-specific documents.",
    ],
    choices: [
      "Choice 1 — preferred ULK programme",
      "Choice 2 — alternative ULK programme",
      "Choice 3 — alternative ULK programme",
    ],
    scholarship: [
      "Check current ULK financial-support announcements.",
      "SDE can assist with identifying external scholarships and preparing applications.",
    ],
    supportNote:
      "SDE can help you prepare the ULK application package and check programme-specific requirements.",
    officialWebsite: "https://ulk.ac.rw/",
    officialApplicationUrl: "https://ulk.ac.rw/",
    sourceUrl: "https://ulk.ac.rw/admission-requirements/",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  UTAB: {
    key: "UTAB",
    name: "University of Technology and Arts of Byumba",
    shortName: "UTAB",
    eyebrow: "PRIVATE UNIVERSITY • BYUMBA",
    description:
      "UTAB undergraduate admission is based on recognised secondary qualifications and applicable HEC requirements, with additional documentation required for registration.",
    accent: "#b45309",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "UTAB's current admission criteria state that Year 1 applicants should have a secondary-school certificate issued by REB or an equivalent qualification.",
      "UTAB's published criteria also reference at least two principal passes under the applicable HEC framework.",
      "Applicants transferring into higher years require additional academic records and equivalence/recognition documents.",
    ],
    documents: [
      "Notarised secondary education certificate/equivalence.",
      "S4, S5 and S6 result reports where requested.",
      "Application letter.",
      "National ID or passport.",
      "CV.",
      "Two passport photographs.",
      "Proof of required fee payment.",
    ],
    important: [
      "UTAB has published separate requirements for first-year admission and transfer applicants.",
      "Programme/faculty-specific requirements should be confirmed before submission.",
    ],
    choices: [
      "Choice 1 — preferred UTAB programme",
      "Choice 2 — alternative UTAB programme",
      "Choice 3 — alternative UTAB programme",
    ],
    scholarship: [
      "Check current UTAB scholarship and financing announcements.",
      "SDE can assist with external scholarship searches.",
    ],
    supportNote:
      "SDE can help prepare UTAB documents and distinguish first-year admission from transfer admission.",
    officialWebsite: "https://utab.ac.rw/",
    officialApplicationUrl: "https://utab.ac.rw/admission-criteria-2/",
    sourceUrl: "https://utab.ac.rw/admission-criteria-2/",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  ICK: {
    key: "ICK",
    name: "Institut Catholique de Kabgayi",
    shortName: "ICK",
    eyebrow: "PRIVATE HIGHER LEARNING INSTITUTION • KABGAYI",
    description:
      "ICK applicants should meet the national higher-education baseline and the specific requirements of the selected programme.",
    accent: "#991b1b",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "Programme-specific admission requirements must be checked with the current ICK admissions office.",
      "Applicants with foreign qualifications should prepare the applicable equivalence documentation.",
      "Health and professional programmes may have additional subject or professional requirements.",
    ],
    documents: [
      "Secondary education certificate or applicable equivalent.",
      "National ID or passport.",
      "Recent passport photograph.",
      "Result information/transcripts where requested.",
      "Equivalence documents for foreign qualifications.",
      "Programme-specific supporting documents where applicable.",
    ],
    important: [
      "Do not treat older admission notices using the former Two Principal Passes system as the complete 2026–2027 rule.",
      "The HEC 17 September 2026 notice must be considered for September 2026 admissions.",
      "Confirm the exact ICK programme requirements before application.",
    ],
    choices: [
      "Choice 1 — preferred ICK programme",
      "Choice 2 — alternative ICK programme",
      "Choice 3 — alternative ICK programme",
    ],
    scholarship: [
      "SDE can help identify current ICK scholarship and financing opportunities.",
      "Scholarship conditions must be verified against the current sponsor notice.",
    ],
    supportNote:
      "SDE can help prepare your ICK application and verify programme-specific documents before you submit.",
    officialWebsite: "https://ick.ac.rw/",
    officialApplicationUrl: "https://ick.ac.rw/",
    sourceUrl: "https://ick.ac.rw/",
    verificationStatus: "GENERAL_GUIDANCE_ONLY",
    lastVerified: "2026-09-17",
  },

  INES: {
    key: "INES",
    name: "INES-Ruhengeri",
    shortName: "INES",
    eyebrow: "PRIVATE HIGHER LEARNING INSTITUTION • MUSANZE",
    description:
      "INES-Ruhengeri offers programmes across health sciences, engineering, technology, science, business, education and other fields.",
    accent: "#0369a1",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "INES publishes programme-specific admission information and application procedures.",
      "International applicants need the applicable equivalence, visa and identification documents.",
      "Some programmes and scholarship schemes have additional selection tests or academic thresholds.",
      "Programme eligibility should be checked against the selected department/programme.",
    ],
    documents: [
      "Secondary certificate/result documentation.",
      "National ID or passport.",
      "Passport photo.",
      "Equivalence certificate where applicable.",
      "Academic transcripts for transfer applicants.",
      "Police clearance and visa documents where required for international students.",
    ],
    important: [
      "INES has a current online admission system.",
      "Current scholarship notices may have their own programme lists and deadlines.",
      "For example, an INES DirectAid 2026 notice listed a 65% Senior Six threshold and additional vulnerability criteria; that was a scholarship-specific requirement, not a universal INES admission rule.",
    ],
    choices: [
      "Choice 1 — preferred INES programme",
      "Choice 2 — alternative INES programme",
      "Choice 3 — alternative INES programme",
    ],
    scholarship: [
      "INES currently publishes scholarship opportunities through its admissions platform.",
      "Scholarship eligibility can include academic results, vulnerability, age, gender or programme-specific conditions depending on the sponsor.",
      "SDE should check the specific scholarship notice before presenting it to a student as available.",
    ],
    supportNote:
      "SDE can help you match your academic background to INES programmes and check scholarship notices separately from admission requirements.",
    officialWebsite: "https://www.ines.ac.rw/",
    officialApplicationUrl: "https://digitalcampus.ines.ac.rw/admission",
    sourceUrl: "https://www.ines.ac.rw/admission/application-information/",
    verificationStatus: "VERIFIED_WITH_PROGRAMME_CHECK",
    lastVerified: "2026-09-17",
  },

  MKU: {
    key: "MKU",
    name: "Mount Kigali University",
    shortName: "MKU",
    eyebrow: "PRIVATE UNIVERSITY • RWANDA",
    description:
      "MKU undergraduate applicants should prepare recognised secondary qualifications, identification and any programme-specific supporting documents.",
    accent: "#166534",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "Programme-specific academic requirements must be confirmed with the current MKU admissions office.",
      "Foreign qualifications require the applicable equivalence documentation.",
      "Professional and health-related programmes may have additional requirements.",
    ],
    documents: [
      "Secondary school certificate or equivalent.",
      "National ID or passport.",
      "Passport-size photograph.",
      "Result slips/transcripts where requested.",
      "Equivalence documentation for foreign qualifications.",
      "Programme-specific supporting documents where applicable.",
    ],
    important: [
      "SDE should verify the current MKU intake, fees, programme-specific requirements and deadlines before displaying them as current.",
      "The HEC 17 September 2026 notice should be applied to the 2026–2027 national admission baseline.",
    ],
    choices: [
      "Choice 1 — preferred MKU programme",
      "Choice 2 — alternative MKU programme",
      "Choice 3 — alternative MKU programme",
    ],
    scholarship: [
      "Check current MKU and external scholarship announcements.",
      "SDE can assist with scholarship-document preparation.",
    ],
    supportNote:
      "SDE can help prepare the MKU application package and identify what still needs verification.",
    officialWebsite: "https://mku.ac.rw/",
    officialApplicationUrl: "https://mku.ac.rw/",
    sourceUrl: "https://mku.ac.rw/",
    verificationStatus: "GENERAL_GUIDANCE_ONLY",
    lastVerified: "2026-09-17",
  },

  UTB: {
    key: "UTB",
    name: "University of Tourism, Technology and Business Studies",
    shortName: "UTB",
    eyebrow: "PRIVATE UNIVERSITY • KIGALI • RUBAVU • RUHANGO",
    description:
      "UTB offers undergraduate programmes across tourism, business and technology and currently publishes admissions and fee information for multiple campuses.",
    accent: "#ca8a04",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "UTB's current admission page requires a notarised S6 Advanced Certificate or equivalent for local applicants.",
      "Applicants need a valid National ID or passport.",
      "UTB also lists recent passport-size photographs among required documents.",
      "Programme-specific requirements should be checked for the selected programme.",
    ],
    documents: [
      "Notarised S6 Advanced Certificate or equivalent.",
      "National ID or passport.",
      "Two passport-size photographs.",
      "Other programme-specific documents where requested.",
      "Payment/registration evidence where applicable.",
    ],
    important: [
      "UTB currently publishes admission information for Kigali, Rubavu and Ruhango campuses.",
      "UTB announced admission requirements and fee structures for Academic Year 2026–2027.",
      "Fees vary by programme and applicant category.",
    ],
    choices: [
      "Choice 1 — preferred UTB programme",
      "Choice 2 — alternative UTB programme",
      "Choice 3 — alternative UTB programme",
    ],
    scholarship: [
      "Check current UTB scholarship and financing announcements.",
      "SDE can help compare tuition and external funding options.",
    ],
    supportNote:
      "SDE can help you compare UTB programmes, campuses, required documents and current fees before application.",
    officialWebsite: "https://utb.ac.rw/",
    officialApplicationUrl: "https://utb.ac.rw/admission/",
    sourceUrl: "https://utb.ac.rw/admission/",
    verificationStatus: "VERIFIED_WITH_PROGRAMME_CHECK",
    lastVerified: "2026-09-17",
  },

  CUR: {
    key: "CUR",
    name: "Catholic University of Rwanda",
    shortName: "CUR",
    eyebrow: "PRIVATE UNIVERSITY • HUYE",
    description:
      "CUR applies national higher-education requirements together with programme-specific academic requirements, especially for health and science programmes.",
    accent: "#7f1d1d",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "CUR's current admission information distinguishes applicants graduating before 2023–2024 from applicants graduating from 2023–2024 onward.",
      "CUR's current online admission page states that applicants from 2023–2024 onward need a minimum 50% average pass mark plus relevant secondary-school subjects for the intended programme.",
      "Health programmes can have additional Biology and Chemistry requirements.",
      "International applicants require an equivalence rating/certificate.",
    ],
    documents: [
      "Secondary school certificate/diploma.",
      "National ID or passport.",
      "Medical certificate where required.",
      "Passport-size photographs.",
      "Application/registration payment evidence where applicable.",
      "Equivalence certificate for international qualifications.",
      "Programme-specific academic evidence where applicable.",
    ],
    important: [
      "CUR publishes programme-specific requirements for Nursing, Midwifery, Public Health, Science and Technology and other fields.",
      "The current CUR admissions page should be checked for the exact programme before submission.",
      "Older two-principal-pass wording should be interpreted together with the current HEC 2026–2027 notice.",
    ],
    choices: [
      "Choice 1 — preferred CUR programme",
      "Choice 2 — alternative CUR programme",
      "Choice 3 — alternative CUR programme",
    ],
    scholarship: [
      "SDE can help identify current CUR scholarship and financing opportunities.",
      "Health-science funding opportunities may have separate academic and selection criteria.",
    ],
    supportNote:
      "SDE can help determine which CUR programme matches your academic background and prepare the required documents.",
    officialWebsite: "https://www.cur.ac.rw/",
    officialApplicationUrl: "https://www.cur.ac.rw/admissionProcess",
    sourceUrl: "https://www.cur.ac.rw/admissionRequirements",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  KEPLER: {
    key: "KEPLER",
    name: "Kepler College",
    shortName: "KEPLER",
    eyebrow: "PRIVATE COLLEGE • KIGALI",
    description:
      "Kepler has its own admissions process in addition to the academic qualification requirements, including an entry assessment and financial commitment information.",
    accent: "#0f766e",
    applicationType: "Undergraduate admission + financial pathway",
    requirements: [
      ...HEC_BASELINE,
      "Kepler's current application page lists two principal passes for Rwandan applicants, subject to the current transition and institutional interpretation.",
      "Applicants should have S4, S5 and S6 result slips.",
      "Kepler states that applicants should have strong English skills and interest in business studies/management.",
      "Applicants participate in Kepler's admission assessment process.",
      "Registration includes additional requirements after admission.",
    ],
    documents: [
      "S4, S5 and S6 result slips.",
      "National examination result information.",
      "National ID, refugee ID or passport as applicable.",
      "Secondary certificate/result slip.",
      "Active email and contact information.",
      "Police clearance for international applicants where required.",
    ],
    important: [
      "Kepler's admissions process includes an admission test.",
      "The current application page states an average of 60% or above in S4–S6 results for online application.",
      "Accepted students must meet registration and financial commitment requirements.",
    ],
    choices: [
      "Choice 1 — preferred Kepler concentration/programme",
      "Choice 2 — alternative",
      "Choice 3 — alternative",
    ],
    scholarship: [
      "Kepler lists scholarship opportunities for eligible refugees in Rwanda and people with disabilities.",
      "Kepler also provides a student-financing/loan-related pathway with financial commitments.",
      "SDE should check the current Kepler intake notice for exact funding availability.",
    ],
    supportNote:
      "SDE can help you prepare the Kepler application, admission-test documents and funding information.",
    officialWebsite: "https://kepler.org/",
    officialApplicationUrl: "https://kepler.org/apply/",
    sourceUrl: "https://kepler.org/apply/",
    verificationStatus: "VERIFIED_OFFICIAL",
    lastVerified: "2026-09-17",
  },

  RICA: {
    key: "RICA",
    name: "Rwanda Institute for Conservation Agriculture",
    shortName: "RICA",
    eyebrow: "SPECIALISED HIGHER EDUCATION • CONSERVATION AGRICULTURE",
    description:
      "RICA is a specialised institution focused on conservation agriculture and related applied learning. Applicants should follow the current RICA intake-specific requirements.",
    accent: "#3f6212",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "RICA admission requirements are programme- and intake-specific.",
      "Applicants should prepare their secondary qualification, identification and academic results.",
      "Selection may involve additional institutional criteria beyond the national qualification baseline.",
    ],
    documents: [
      "Secondary education certificate/result documentation.",
      "National ID or passport.",
      "Passport-size photograph.",
      "Academic transcripts/results where requested.",
      "Additional RICA-specific documents where required.",
      "Equivalence documentation for foreign qualifications where applicable.",
    ],
    important: [
      "RICA is a specialised institution, so SDE should not treat its admission process as identical to UR or RP.",
      "Scholarship opportunities may be attached to specific RICA intakes and should be verified from the current official announcement.",
    ],
    choices: [
      "Choice 1 — RICA programme",
      "Choice 2 — alternative where available",
      "Choice 3 — alternative where available",
    ],
    scholarship: [
      "RICA has historically advertised scholarship-supported study opportunities.",
      "Scholarship availability, eligibility and intake dates must be verified against the current RICA announcement before publication.",
    ],
    supportNote:
      "SDE can help you understand RICA's current intake requirements and prepare the application documents.",
    officialWebsite: "https://rica.rw/",
    officialApplicationUrl: "https://rica.rw/",
    sourceUrl: "https://rica.rw/",
    verificationStatus: "GENERAL_GUIDANCE_ONLY",
    lastVerified: "2026-09-17",
  },

  PIASS: {
    key: "PIASS",
    name: "Protestant Institute of Arts and Social Sciences",
    shortName: "PIASS",
    eyebrow: "PRIVATE HIGHER LEARNING INSTITUTION • HUYE",
    description:
      "PIASS offers programmes in education, social sciences, humanities and related fields. Exact undergraduate programme requirements should be checked with the current admissions office.",
    accent: "#1d4ed8",
    applicationType: "Undergraduate admission",
    requirements: [
      ...HEC_BASELINE,
      "Programme-specific requirements should be confirmed from the current PIASS undergraduate admission notice.",
      "Foreign qualifications require applicable equivalence documentation.",
      "Some professional or specialised programmes may require additional academic evidence.",
    ],
    documents: [
      "Secondary education certificate or equivalent.",
      "National ID or passport.",
      "Passport-size photographs.",
      "Academic result slips/transcripts where required.",
      "Equivalence documentation where applicable.",
      "Programme-specific supporting documents where requested.",
    ],
    important: [
      "Do not reuse old PIASS postgraduate requirements for undergraduate applicants.",
      "SDE should verify the current undergraduate programme list, requirements, fees and deadline before publishing a specific claim.",
      "The HEC 17 September 2026 national admission notice applies to the 2026–2027 admission baseline.",
    ],
    choices: [
      "Choice 1 — preferred PIASS programme",
      "Choice 2 — alternative PIASS programme",
      "Choice 3 — alternative PIASS programme",
    ],
    scholarship: [
      "Check current PIASS and external scholarship announcements.",
      "SDE can assist with scholarship application preparation.",
    ],
    supportNote:
      "SDE can help prepare your PIASS application and verify the exact undergraduate requirements before submission.",
    officialWebsite: "https://piass.ac.rw/",
    officialApplicationUrl: "https://piass.ac.rw/",
    sourceUrl: "https://piass.ac.rw/",
    verificationStatus: "GENERAL_GUIDANCE_ONLY",
    lastVerified: "2026-09-17",
  },
};
