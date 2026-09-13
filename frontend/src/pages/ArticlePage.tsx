import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { newsSeed } from "../data/newsSeed";
import type { NewsPost } from "../types/news";

const STORAGE_KEY = "sde-career-connect-news";

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPosts(): NewsPost[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return newsSeed;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return newsSeed;
    }

    return parsed.map((post: NewsPost) => ({
      ...post,
      slug: post.slug || createSlug(post.title),
    }));
  } catch {
    return newsSeed;
  }
}

function renderArticleContent(content: string) {
  return content.split("\n").map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const posts = getPosts();

  const post = posts.find(
    (article) =>
      article.slug === slug && article.status === "published",
  );

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SDE Career Connect`;
    } else {
      document.title = "Article not found | SDE Career Connect";
    }
  }, [post]);

  if (!post) {
    return (
      <main className="article-page">
        <h1>Article not found</h1>
        <p>
          This article may have been removed or is not yet published.
        </p>
        <Link to="/">Return to homepage</Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link to="/">← Back to homepage</Link>

      <article>
        {post.image ? (
          <img src={post.image} alt={post.title} />
        ) : (
          <div>{post.icon}</div>
        )}

        <p>{post.category}</p>
        <h1>{post.title}</h1>
        <p>
          {post.date} · {post.author}
        </p>
        <p>{post.summary}</p>

        <div>{renderArticleContent(post.content)}</div>

        {post.applicationLink && (
          <a href={post.applicationLink} target="_blank" rel="noreferrer">
            Apply now
          </a>
        )}

        {post.youtubeLink && (
          <a href={post.youtubeLink} target="_blank" rel="noreferrer">
            Watch video
          </a>
        )}

        {post.whatsappLink && (
          <a href={post.whatsappLink} target="_blank" rel="noreferrer">
            Join WhatsApp
          </a>
        )}
      </article>
    </main>
  );
}
