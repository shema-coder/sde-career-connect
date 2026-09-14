import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import type { NewsPost } from "../types/news";

function renderArticleContent(content: string) {
  return content.split("\n").map((paragraph, index) => {
    const trimmed = paragraph.trim();

    if (!trimmed) {
      return <div className="public-article-spacer" key={index} />;
    }

    return <p key={index}>{trimmed}</p>;
  });
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await apiRequest<NewsPost[]>("/news");
        setPosts(data);
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

            {(post.applicationLink ||
              post.youtubeLink ||
              post.whatsappLink) && (
              <div className="public-article-actions">
                <div>
                  <span className="article-actions-label">
                    TAKE THE NEXT STEP
                  </span>
                  <h2>Ready to move forward?</h2>
                </div>

                <div className="article-action-buttons">
                  {post.applicationLink && (
                    <a
                      className="article-action-button article-action-primary"
                      href={post.applicationLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Apply now
                      <span>↗</span>
                    </a>
                  )}

                  {post.youtubeLink && (
                    <a
                      className="article-action-button article-action-secondary"
                      href={post.youtubeLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch video
                      <span>▶</span>
                    </a>
                  )}

                  {post.whatsappLink && (
                    <a
                      className="article-action-button article-action-whatsapp"
                      href={post.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join WhatsApp
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
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
