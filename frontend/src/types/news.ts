export type NewsStatus = "draft" | "published";

export type NewsCategory =
  | "Scholarships"
  | "University"
  | "Career"
  | "Education"
  | "Announcements";

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  date: string;
  author: string;
  icon: string;
  image?: string;
  applicationLink?: string;
  youtubeLink?: string;
  whatsappLink?: string;
  status: NewsStatus;
  featured: boolean;
  urgent: boolean;
}
