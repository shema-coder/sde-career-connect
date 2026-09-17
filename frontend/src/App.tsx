import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "./lib/api";
import type { NewsCategory, NewsPost } from "./types/news";
import "./App.css";
import ApplicationSupport from "./pages/ApplicationSupport";
import MemberRegistration from "./pages/MemberRegistration";

const WHATSAPP_GROUP =
  "https://chat.whatsapp.com/KdxQwE1skoLIsmLC3i0HmK";

const WHATSAPP_DIRECT = "https://wa.me/250796371484";


const categories: Array<"All" | NewsCategory> = [
  "All",
  "Scholarships",
  "University",
  "Career",
  "Education",
  "Announcements",
];

function App() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showApplicationSupport, setShowApplicationSupport] = useState(false);
  const [applicationSupportView, setApplicationSupportView] =
    useState<"form" | "tracking">("form");

  const [importedURChoices, setImportedURChoices] = useState<
    [string, string, string] | null
  >(null);
  const [activeCategory, setActiveCategory] = useState<"All" | NewsCategory>("All");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showMemberRegistration, setShowMemberRegistration] =
    useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("applicationSupport") !== "1") {
      return;
    }

    const institution =
      sessionStorage.getItem("sde:open-application-support");

    if (institution !== "UR") {
      return;
    }

    const storedChoices = sessionStorage.getItem(
      "sde:confirmed-ur-choices",
    );

    if (storedChoices) {
      try {
        const parsed = JSON.parse(storedChoices);

        const names = [0, 1, 2].map((index) => {
          const choice = parsed[index];

          if (!choice) return "";

          return choice.programmeCode
            ? `${choice.programmeName || ""} (${choice.programmeCode})`
            : choice.programmeName || "";
        }) as [string, string, string];

        if (names.some(Boolean)) {
          setImportedURChoices(names);
        }
      } catch {
        console.error("Could not restore confirmed UR choices.");
      }
    }

    setApplicationSupportView("form");
    setShowApplicationSupport(true);

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname,
    );

    sessionStorage.removeItem("sde:open-application-support");
    sessionStorage.removeItem("sde:confirmed-ur-choices");
  }, []);

  useEffect(() => {
    function handleOpenRegistration() {
      setShowMemberRegistration(true);
    }

    window.addEventListener(
      "sde-open-registration",
      handleOpenRegistration,
    );

    const params = new URLSearchParams(window.location.search);

    if (params.get("register") === "1") {
      setShowMemberRegistration(true);

      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );
    }

    return () => {
      window.removeEventListener(
        "sde-open-registration",
        handleOpenRegistration,
      );
    };
  }, []);

  useEffect(() => {
    async function loadMemberCount() {
      try {
        const data = await apiRequest<{ count: number }>(
          "/members/count",
        );
        setMemberCount(data.count);
      } catch (error) {
        console.error("Failed to load member count:", error);
      }
    }

    void loadMemberCount();
  }, []);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await apiRequest<NewsPost[]>("/news");
        setPosts(data);
      } catch (error) {
        console.error("Failed to load published news:", error);
        setPosts([]);
      }
    }

    void loadPosts();
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
            <Link
              to="/find-opportunities"
              onClick={() => setMenuOpen(false)}
              className="nav-opportunity-finder"
            >
              Find My Opportunities
            </Link>
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

            <button
              type="button"
              className="nav-member-button"
              onClick={() => {
                setMenuOpen(false);
                setShowMemberRegistration(true);
              }}
            >
              Register Now
            </button>

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
                <Link
                  className="button button-yellow finder-hero-button"
                  to="/find-opportunities"
                  aria-label="Find your study options"
                >
                  🔎 Find Your Study Options →
                </Link>
                <a className="button button-outline-light" href="#opportunities">
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

              <div className="finder-hero-hint">
                <strong>Not sure what you can study?</strong>
                <span>
                  Check programmes, UR & RP options, historical marks,
                  scholarships and official requirements.
                </span>
              </div>

              <div className="hero-member-register">
                <div>
                  <strong>Join the SDE community</strong>
                  <span>
                    Get connected to new scholarships, admissions and
                    opportunities.
                  </span>
                </div>

                <button
                  type="button"
                  className="button button-yellow"
                  onClick={() => setShowMemberRegistration(true)}
                >
                  JOIN SDE CAREER CONNECT →
                </button>
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
                      <a
                        className="read-more"
                        href={`/articles/${post.slug}`}
                      >
                        Read More <span>↗</span>
                      </a>

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

        <section className="member-community-section" id="members">
          <div className="container member-community-card">
            <div>
              <span className="section-kicker">
                SDE CAREER CONNECT COMMUNITY
              </span>
              <h2>Growing together. Moving forward.</h2>
              <p>
                Join students and graduates staying connected to
                scholarships, admissions, careers and opportunities.
              </p>
            </div>

            <div className="member-community-number">
              <strong>{memberCount.toLocaleString()}+</strong>
              <span>REGISTERED MEMBERS</span>
            </div>

            <button
              type="button"
              className="button button-yellow"
              onClick={() => setShowMemberRegistration(true)}
            >
              REGISTER NOW →
            </button>
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
      

      {/* =====================================================
          SDE WRITING HELP — SMART HOMEPAGE CARD
          ===================================================== */}
      <section className="sde-writing-home-section" aria-labelledby="writing-help-home-title">
        <div className="sde-writing-home-card">

          <div className="sde-writing-home-copy">
            <div className="sde-writing-home-badge">
              <span className="sde-writing-badge-dot"></span>
              SDE WRITING HELP
            </div>

            <h2 id="writing-help-home-title">
              Need help with your <span>writing?</span>
            </h2>

            <p>
              Get practical support with CVs, motivation letters,
              scholarship essays, application letters, academic writing
              and more.
            </p>

            <div className="sde-writing-home-mini-tags">
              <span>CV</span>
              <span>Motivation Letter</span>
              <span>Scholarship Essay</span>
              <span>Application Letter</span>
            </div>

            <a
              href="/writing-help"
              className="sde-writing-home-cta"
            >
              <span>GET WRITING HELP</span>
              <strong>→</strong>
            </a>

            <div className="sde-writing-home-language">
              English <span>•</span> Français
            </div>
          </div>

          <div className="sde-writing-home-visual" aria-hidden="true">

            <div className="sde-writing-paper">
              <div className="sde-writing-paper-top">
                <span className="sde-writing-paper-logo">SDE</span>
                <span className="sde-writing-paper-check">✓</span>
              </div>

              <div className="sde-writing-paper-heading"></div>

              <div className="sde-writing-line line-1"></div>
              <div className="sde-writing-line line-2"></div>
              <div className="sde-writing-line line-3"></div>
              <div className="sde-writing-line line-4"></div>

              <div className="sde-writing-paper-highlight"></div>

              <div className="sde-writing-signature">
                <span></span>
                <small>Ready to submit</small>
              </div>
            </div>

            <div className="sde-writing-pen">
              <div className="sde-pen-tip"></div>
              <div className="sde-pen-body"></div>
              <div className="sde-pen-grip"></div>
              <div className="sde-pen-cap"></div>
            </div>

            <div className="sde-writing-floating-chip chip-cv">
              <span>✓</span> CV
            </div>

            <div className="sde-writing-floating-chip chip-essay">
              <span>✎</span> Essay
            </div>

            <div className="sde-writing-floating-chip chip-letter">
              <span>✉</span> Letter
            </div>

            <div className="sde-writing-orbit orbit-one"></div>
            <div className="sde-writing-orbit orbit-two"></div>

          </div>
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

      {showMemberRegistration && (
        <MemberRegistration
          onClose={() => setShowMemberRegistration(false)}
          onRegistered={() => {
            void apiRequest<{ count: number }>("/members/count")
              .then((data) => setMemberCount(data.count))
              .catch((error) =>
                console.error(
                  "Failed to refresh member count:",
                  error,
                ),
              );
          }}
        />
      )}

      {/*
        * Opportunity Finder → Application Support bridge.
        * The planner dispatches the confirmed three UR choices.
        */}

      {showApplicationSupport && (
        <ApplicationSupport
          initialView={applicationSupportView}
          initialURChoices={importedURChoices}
          onClose={() => {
            setShowApplicationSupport(false);
          }}
        />
      )}
    </>

  );
}

export default App;
