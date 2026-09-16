import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import type { NewsPost } from "../types/news";

type ApiNewsPost = NewsPost & {
  application_link?: string | null;
  youtube_link?: string | null;
  whatsapp_link?: string | null;
};

function normalizeNewsPost(post: ApiNewsPost): NewsPost {
  return {
    ...post,
    applicationLink:
      post.applicationLink ?? post.application_link ?? "",
    youtubeLink:
      post.youtubeLink ?? post.youtube_link ?? "",
    whatsappLink:
      post.whatsappLink ?? post.whatsapp_link ?? "",
  };
}

function extractUrls(content: string): string[] {
  const matches = content.match(/https?:\/\/[^\s]+/g) ?? [];

  return matches.map((url) =>
    url.replace(/[),.;!?]+$/, ""),
  );
}

function renderArticleContent(content: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return content.split("\n").map((paragraph, index) => {
    const trimmed = paragraph.trim();

    if (!trimmed) {
      return <div className="public-article-spacer" key={index} />;
    }

    const parts = trimmed.split(urlPattern);

    return (
      <p key={index}>
        {parts.map((part, partIndex) =>
          /^https?:\/\/[^\s]+$/.test(part) ? (
            <a
              key={partIndex}
              href={part.replace(/[),.;!?]+$/, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="public-article-inline-link"
            >
              {part}
            </a>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await apiRequest<ApiNewsPost[]>("/news");
        setPosts(data.map(normalizeNewsPost));
      } catch (error) {
        console.error("Failed to load article:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    void loadPosts();
  }, []);

  const post = posts.find(
    (article) =>
      article.slug === slug && article.status === "published",
  );

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SDE Career Connect`;
    } else if (!loading) {
      document.title = "Article not found | SDE Career Connect";
    }
  }, [post, loading]);

  if (loading) {
    return (
      <main className="public-article-page">
        <div className="public-article-container">
          <section className="article-not-found">
            <span className="public-article-eyebrow">
              SDE CAREER CONNECT
            </span>
            <h1>Loading article...</h1>
          </section>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="public-article-page">
        <div className="public-article-container">
          <section className="article-not-found">
            <span className="article-not-found-icon">!</span>
            <span className="public-article-eyebrow">
              SDE CAREER CONNECT
            </span>
            <h1>Article not found</h1>
            <p>
              This article may have been removed or is not yet published.
            </p>
            <Link className="article-primary-button" to="/">
              Return to homepage
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="public-article-page">
      <header className="public-article-header">
        <div className="public-article-container article-header-inner">
          <Link className="article-brand" to="/" aria-label="SDE Career Connect home">
            {post.icon ? (
              <span className="article-brand-mark">{post.icon}</span>
            ) : (
              <span className="article-brand-mark">SDE</span>
            )}

            <span>
              <strong>SDE CAREER CONNECT</strong>
              <small>Student Opportunities & Support</small>
            </span>
          </Link>

          <Link className="article-home-link" to="/">
            <span>←</span>
            Back to homepage
          </Link>
        </div>
      </header>

      <div className="public-article-container">
        <article className="public-article-card">
          <div className="public-article-hero">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="public-article-image"
              />
            ) : (
              <div className="public-article-image-placeholder">
                <span>{post.icon || "SDE"}</span>
                <strong>SDE CAREER CONNECT</strong>
              </div>
            )}
          </div>

          <div className="public-article-content">
            <div className="public-article-category">
              <span />
              {post.category}
            </div>

            <h1 className="public-article-title">{post.title}</h1>

            <div className="public-article-meta">
              <span>{post.date}</span>
              <i>•</i>
              <span>By {post.author}</span>
            </div>

            {post.summary && (
              <p className="public-article-summary">{post.summary}</p>
            )}

            <div className="public-article-divider" />

            <div className="public-article-body">
              {renderArticleContent(post.content)}
            </div>

            {(() => {
              const DEFAULT_YOUTUBE_APPLICATION_URL =
    "https://www.youtube.com/@STOREROOMDIGITALEMPIRE";

  const urls = extractUrls(post.content);

              const applicationLink =
                post.applicationLink ||
                urls.find(
                  (url) =>
                    /apply|application/i.test(url) &&
                    !/youtube\.com|youtu\.be|whatsapp\.com/i.test(url),
                );

              const youtubeLink =
    post.youtubeLink ||
    urls.find((url) =>
      /youtube\\.com|youtu\\.be/i.test(url),
    ) ||
    DEFAULT_YOUTUBE_APPLICATION_URL;

              const whatsappLink =
                post.whatsappLink ||
                urls.find((url) =>
                  /chat\.whatsapp\.com|wa\.me/i.test(url),
                );

              return (
                <div className="public-article-actions">
                  <div className="public-article-actions-heading">
                    <span className="article-actions-label">
                      TAKE THE NEXT STEP
                    </span>

                    <h2>Choose what you need and continue</h2>

                    <p>
                      Apply, learn how to apply, connect with us, or register
                      for SDE Career Connect support.
                    </p>
                  </div>

                  <div className="article-action-buttons">
                    {applicationLink && (
                      <a
                        className="article-action-button article-action-primary"
                        href={applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="article-action-icon">↗</span>
                        <span className="article-action-copy">
                          <strong>APPLY NOW</strong>
                          <small>Start your application</small>
                        </span>
                      </a>
                    )}

                    {youtubeLink && (
                      <a className="article-action-button article-action-secondary" href={youtubeLink} target="_blank" rel="noopener noreferrer">
            <span className="article-action-icon">
              <img
                src="/assets/youtube-logo.webp"
                alt=""
                className="article-action-logo"
              />
            </span>
            <span className="article-action-copy">
                          <strong>YOUTUBE GUIDE</strong>
                          <small>Application steps</small>
                        </span>
                      </a>
                    )}

                    {whatsappLink && (
                      <a className="article-action-button article-action-whatsapp" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <span className="article-action-icon">
              <img
                src="/assets/whatsapp-logo.webp"
                alt=""
                className="article-action-logo"
              />
            </span>
            <span className="article-action-copy">
                          <strong>JOIN WHATSAPP</strong>
                          <small>Get student support</small>
                        </span>
                      </a>
                    )}

                    <a
                      className="article-action-button article-action-register"
                      href="/?register=1"
                    >
                      <span className="article-action-icon">📝</span>
                      <span className="article-action-copy">
                        <strong>REGISTER NOW</strong>
                        <small>Join SDE Career Connect</small>
                      </span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </article>

        <section className="public-article-bottom">
          <div>
            <span className="public-article-eyebrow">SDE CAREER CONNECT</span>
            <h2>Helping students discover their next opportunity.</h2>
          </div>

          <Link className="article-secondary-button" to="/">
            Explore more opportunities
            <span>→</span>
          </Link>
        </section>
      </div>

      <footer className="public-article-footer">
        <div className="public-article-container article-footer-inner">
          <div>
            <strong>SDE CAREER CONNECT</strong>
            <span>Powered by STOREROOM DIGITAL EMPIRE</span>
          </div>

          <span>© {new Date().getFullYear()} SDE Career Connect</span>
        </div>
      </footer>
    </main>
  );
}
