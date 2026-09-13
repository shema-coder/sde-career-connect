import { useEffect, useMemo, useState } from "react";
import { newsSeed } from "./data/newsSeed";
import type { NewsCategory, NewsPost } from "./types/news";
import "./App.css";
import ApplicationSupport from "./pages/ApplicationSupport";

const WHATSAPP_GROUP =
  "https://chat.whatsapp.com/KdxQwE1skoLIsmLC3i0HmK";

const WHATSAPP_DIRECT = "https://wa.me/250796371484";

const STORAGE_KEY = "sde-career-connect-news";

const categories: Array<"All" | NewsCategory> = [
  "All",
  "Scholarships",
  "University",
  "Career",
  "Education",
  "Announcements",
];

function App() {
  const [posts, setPosts] = useState<NewsPost[]>(newsSeed);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showApplicationSupport, setShowApplicationSupport] = useState(false);
  const [applicationSupportView, setApplicationSupportView] =
    useState<"form" | "tracking">("form");
  const [activeCategory, setActiveCategory] = useState<"All" | NewsCategory>("All");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setPosts(newsSeed);
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setPosts(parsed);
      } else {
        setPosts(newsSeed);
      }
    } catch {
      setPosts(newsSeed);
    }
  }, []);

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.status === "published"),
    [posts]
  );

  const filteredPosts =
    activeCategory === "All"
      ? publishedPosts
      : publishedPosts.filter((post) => post.category === activeCategory);

  
const renderArticleContent = (content: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return content.split("\n").map((paragraph, paragraphIndex) => (
    <p key={paragraphIndex}>
      {paragraph.split(urlPattern).map((part, partIndex) =>
        /^https?:\/\/[^\s]+$/.test(part) ? (
          <a
            key={partIndex}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="article-inline-link"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  ));
};

const selectedPostData = publishedPosts.find(
    (post) => post.id === selectedPost
  );

  return (
    <>
    <>

    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-container">
          <a className="brand" href="#home" aria-label="SDE Career Connect home">
            <img
              className="brand-logo"
              src="/assets/sde-logo-updated.png"
              alt="SDE Career Connect logo"
            />

            <div className="brand-copy">
              <strong>SDE CAREER CONNECT</strong>
              <span>Connecting Students to Opportunities</span>
            </div>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Opportunities
            </a>
            <a
              href="#support"
              onClick={(event) => {
                event.preventDefault();
                setMenuOpen(false);
                setApplicationSupportView("form");
                setShowApplicationSupport(true);
              }}
            >
              Application Support
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About Us
            </a>

            <a
              className="nav-whatsapp"
              href={WHATSAPP_GROUP}
              target="_blank"
              rel="noreferrer"
            >
              Join WhatsApp ↗
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="container hero-grid">
            <div className="hero-content">
              <span className="eyebrow">
                🎓 YOUR FUTURE STARTS HERE
              </span>

              <h1>
                Discover opportunities.
                <span> Build your future.</span>
              </h1>

              <p>
                SDE Career Connect helps students discover scholarships,
                universities, courses, internships, career guidance, and
                application support.
              </p>

              <div className="hero-actions">
                <a className="button button-yellow" href="#opportunities">
                  Explore Opportunities ↗
                </a>

                <button
                  type="button"
                  className="button button-track-application"
                  onClick={() => {
                    setApplicationSupportView("tracking");
                    setShowApplicationSupport(true);
                  }}
                >
                  Track My Application →
                </button>

                <a
                  className="button button-outline-light"
                  href={WHATSAPP_GROUP}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join Our WhatsApp Group
                </a>
              </div>

              <div className="hero-trust">
                <div>
                  <strong>2+</strong>
                  <span>Years of experience</span>
                </div>
                <div>
                  <strong>10+</strong>
                  <span>Scholarship recipients</span>
                </div>
                <div>
                  <strong>100+</strong>
                  <span>University admissions</span>
                </div>
              </div>
            </div>

            <div className="hero-video-card">
              <div className="video-heading">
                <span className="video-live-dot" />
                <span>Discover Your Next Opportunity</span>
                <span className="video-badge">SDE CAREER CONNECT</span>
              </div>

              <div className="video-frame">
                <video
                  className="hero-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/assets/sde-logo-updated.png"
                  aria-label="SDE Career Connect promotional video"
                >
                  <source
                    src="/assets/videos/sde-career-connect.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support embedded videos.
                </video>

                <div className="video-overlay">
                  <img
                    src="/assets/sde-logo-updated.png"
                    alt="SDE Career Connect logo"
                    className="video-overlay-logo"
                  />
                  <span>Learn. Apply. Succeed.</span>
                </div>
              </div>

              <div className="video-card-footer">
                <div>
                  <strong>Ready for your next step?</strong>
                  <span>Get guidance on scholarships, admissions and careers.</span>
                </div>

                <a
                  className="video-contact-link"
                  href="https://wa.me/250796371484"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat with us <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="opportunities-section" id="opportunities">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">LATEST UPDATES</span>
                <h2>Latest Opportunities</h2>
                <p>
                  Explore useful opportunities and important guidance prepared
                  for students and future leaders.
                </p>
              </div>

              <a className="text-link" href="#support">
                Need application help? ↗
              </a>
            </div>

            <div className="category-tabs" aria-label="Opportunity categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="opportunity-grid">
              {filteredPosts.map((post, index) => (
                <article
                  className={`opportunity-card ${
                    index === 0 && activeCategory === "All"
                      ? "featured-card"
                      : ""
                  }`}
                  key={post.id}
                >
                  <div className="post-visual">
                    <div className="post-pattern" />

                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="post-image"
                      />
                    ) : (
                      <span className="post-icon">
                        {post.icon || "🎓"}
                      </span>
                    )}

                    {post.urgent && (
                      <span className="urgent-badge">Important Update</span>
                    )}

                    <span className="post-number">
                      0{post.id}
                    </span>
                  </div>

                  <div className="post-body">
                    <div className="post-meta">
                      <span>{post.category}</span>
                      <small>{post.featured ? 'Featured Opportunity' : post.author}</small>
                    </div>

                    <h3>{post.title}</h3>

                    <p>{post.summary}</p>

                    <div className="post-footer">
                      <button
                        className="read-more"
                        onClick={() => setSelectedPost(post.id)}
                      >
                        Read More <span>↗</span>
                      </button>

                      <a
                        className="post-whatsapp"
                        href={WHATSAPP_GROUP}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp <span>↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="support-section" id="support">
          <div className="container support-grid">
            <div className="support-image-wrap">
              <div className="support-image-glow" />

              <img
                className="support-image"
                src="/assets/scholarship-assistant-manager.png"
                alt="SHEMA Aime Pacifique, Scholarship Assistant Manager at SDE Career Connect"
              />

              <div className="support-image-label">
                <strong>SHEMA Aime Pacifique</strong>
                <span>Scholarship Assistant Manager</span>
              </div>
            </div>

            <div className="support-content">
              <span className="section-kicker">APPLICATION SUPPORT</span>

              <h2>
                Preparing your application should not be confusing.
              </h2>

              <p>
                We guide students through scholarship applications, university
                admissions, study-abroad opportunities, and career decisions.
              </p>

              <div className="support-checklist">
                <div>✓ National ID or Passport</div>
                <div>✓ S6 Certificate or Results Slip</div>
                <div>✓ Academic Transcripts</div>
                <div>✓ CV and Motivation Letter</div>
                <div>✓ Recommendation Letters</div>
                <div>✓ English Proficiency Documents</div>
              </div>

              <div className="support-actions">
                <a
                  className="button button-yellow"
                  href="https://rne.sdms.gov.rw/results"
                  target="_blank"
                  rel="noreferrer"
                >
                  Check S6 Results ↗
                </a>

                <a
                  className="button button-dark"
                  href={WHATSAPP_GROUP}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Application Help ↗
                </a>
              </div>

              <a className="support-phone" href="tel:+250796371484">
                ☎ +250 796 371 484
              </a>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container about-card">
            <div>
              <span className="section-kicker">WHY SDE CAREER CONNECT?</span>
              <h2>From results day to your next big opportunity.</h2>
            </div>

            <p>
              SDE Career Connect connects students to universities, courses,
              scholarships, study-abroad opportunities, jobs, internships,
              education opportunities, and career guidance.
            </p>

            <a
              className="button button-yellow"
              href={WHATSAPP_GROUP}
              target="_blank"
              rel="noreferrer"
            >
              Join the Student Community ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <img
              src="/assets/sde-logo-updated.png"
              alt="SDE logo"
            />

            <div>
              <strong>SDE CAREER CONNECT</strong>
              <span>Powered by STOREROOM DIGITAL EMPIRE</span>
            </div>
          </div>

          <div className="footer-links">
            <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer">
              WhatsApp Group
            </a>
            <a href={WHATSAPP_DIRECT} target="_blank" rel="noreferrer">
              Direct Support
            </a>
            <a href="tel:+250796371484">+250 796 371 484</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 SDE Career Connect. All rights reserved.</span>
          <span>Connecting Students to Opportunities.</span>
        </div>
      </footer>

      {selectedPostData && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedPost(null)}
        >
          <article
            className="post-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
            >
              ✕
            </button>

            {selectedPostData.image ? (
              <img
                src={selectedPostData.image}
                alt={selectedPostData.title}
                className="modal-post-image"
              />
            ) : (
              <div className="article-modal-icon">
                {selectedPostData.icon || "🎓"}
              </div>
            )}

            <span className="section-kicker">
              {selectedPostData.category}
            </span>

            <h2 id="post-modal-title">
              {selectedPostData.title}
            </h2>

            <p className="modal-post-author">
              {selectedPostData.date} · {selectedPostData.author}
            </p>

            <p>
              {selectedPostData.summary}
            </p>

            <div className="modal-article-content">
              {renderArticleContent(selectedPostData.content)}
            </div>

            <div className="article-action-links">
              {selectedPostData.applicationLink && (
                <a
                  className="button button-yellow"
                  href={selectedPostData.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Apply Now ↗
                </a>
              )}

              {selectedPostData.youtubeLink && (
                <a
                  className="button button-dark"
                  href={selectedPostData.youtubeLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Application Process ↗
                </a>
              )}

              {selectedPostData.whatsappLink && (
                <a
                  className="button button-outline"
                  href={selectedPostData.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join WhatsApp Group ↗
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </div>    </>

      {showApplicationSupport && (
        <ApplicationSupport
          initialView={applicationSupportView}
          onClose={() => {
            setShowApplicationSupport(false);
          }}
        />
      )}
    </>

  );
}

export default App;
