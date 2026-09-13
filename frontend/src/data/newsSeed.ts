import type { NewsPost } from "../types/news";

export const newsSeed: NewsPost[] = [
  {
    id: 1,
    slug: "scholarship-preparation-guide-s6-graduates",
    title: "Scholarship Preparation Guide for S6 Graduates",
    summary:
      "Important steps that S6 graduates should follow when preparing scholarship applications.",
    content:
      "Students should prepare academic documents, recommendation letters, motivation letters, identification documents, and proof of financial need where required. Always check the official scholarship requirements and application deadlines before submitting your application.",
    category: "Scholarships",
    date: "12 Sep 2026",
    author: "SDE Career Connect",
    icon: "🎓",
    status: "published",
    featured: true,
    urgent: false,
  },
  {
    id: 2,
    slug: "next-step-after-s6-university-admission",
    title: "Your Next Step After S6: University Admission",
    summary:
      "A practical guide for students preparing to join university after completing secondary school.",
    content:
      "After receiving your examination results, identify suitable university programmes, compare entry requirements, prepare the required documents, and follow official admission announcements. Students should avoid relying on unverified social-media information.",
    category: "University",
    date: "12 Sep 2026",
    author: "SDE Career Connect",
    icon: "🏫",
    status: "published",
    featured: true,
    urgent: true,
  },
  {
    id: 3,
    slug: "skills-internships-career-opportunities",
    title: "Discover Skills, Internships and Career Opportunities",
    summary:
      "Explore useful skills, internships, and career opportunities for students and young professionals.",
    content:
      "Students can improve their career readiness by developing communication, digital, leadership, teamwork, and problem-solving skills. They should also follow internship announcements, attend career events, and prepare a professional CV.",
    category: "Career",
    date: "12 Sep 2026",
    author: "SDE Career Connect",
    icon: "🧭",
    status: "published",
    featured: false,
    urgent: false,
  },
];
