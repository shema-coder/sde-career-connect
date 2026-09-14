import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import type {
  NewsCategory,
  NewsPost,
  NewsStatus,
} from "../../types/news";
import { apiRequest } from "../../lib/api";
import "./Admin.css";

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categories: NewsCategory[] = [
  "Scholarships",
  "University",
  "Career",
  "Education",
  "Announcements",
];

const emptyPost: Omit<NewsPost, "id"> = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  category: "Scholarships",
  date: "",
  author: "SDE Career Connect",
  icon: "🎓",
  image: "",
  applicationLink: "",
  youtubeLink: "",
  whatsappLink: "",
  status: "draft",
  featured: false,
  urgent: false,
};

export default function AdminNews() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const authenticated = localStorage.getItem(
      "sde_admin_authenticated",
    );

    if (authenticated !== "true") {
      navigate("/admin");
      return;
    }

    async function loadPosts() {
      try {
        const data = await apiRequest<NewsPost[]>("/admin/news");
        setPosts(data);
      } catch (error) {
        console.error("Failed to load news posts:", error);
        setMessage("Unable to load articles from the server.");
      }
    }

    void loadPosts();
  }, [navigate]);

  function updateField<K extends keyof Omit<NewsPost, "id">>(
    field: K,
    value: Omit<NewsPost, "id">[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "title" && typeof value === "string"
        ? { slug: createSlug(value) }
        : {}),
    }));
  }

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose a valid image file.");
      return;
    }

    if (file.size > 2_000_000) {
      setMessage("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField("image", String(reader.result));
      setMessage("Photo added successfully.");
    };

    reader.readAsDataURL(file);
  }

  function startCreate() {
    setEditingId(null);
    setForm({
      ...emptyPost,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setMessage("");
  }

  function startEdit(post: NewsPost) {
    setEditingId(post.id);

    setForm({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      content: post.content,
      category: post.category,
      date: post.date,
      author: post.author,
      icon: post.icon,
      image: post.image ?? "",
      applicationLink: post.applicationLink ?? "",
      youtubeLink: post.youtubeLink ?? "",
      whatsappLink: post.whatsappLink ?? "",
      status: post.status,
      featured: post.featured,
      urgent: post.urgent,
    });

    setMessage("");
  }

  async function savePost() {
    if (
      !form.title.trim() ||
      !form.summary.trim() ||
      !form.content.trim()
    ) {
      setMessage(
        "Please complete the title, summary, and article content.",
      );
      return;
    }

    const payload = {
      slug: form.slug || createSlug(form.title),
      title: form.title,
      summary: form.summary,
      content: form.content,
      category: form.category,
      date: form.date,
      author: form.author,
      icon: form.icon,
      image: form.image || null,
      applicationLink: form.applicationLink || null,
      youtubeLink: form.youtubeLink || null,
      whatsappLink: form.whatsappLink || null,
      status: form.status,
      featured: form.featured,
      urgent: form.urgent,
    };

    try {
      if (editingId !== null) {
        const updatedPost = await apiRequest<NewsPost>(
          `/admin/news/${editingId}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );

        setPosts((current) =>
          current.map((post) =>
            post.id === editingId ? updatedPost : post,
          ),
        );

        setMessage("Article updated successfully.");
      } else {
        const createdPost = await apiRequest<NewsPost>(
          "/admin/news",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        );

        setPosts((current) => [createdPost, ...current]);
        setMessage("Article created successfully.");
      }

      setEditingId(null);
      setForm(emptyPost);
    } catch (error) {
      console.error("Failed to save article:", error);
      setMessage("Unable to save the article. Please try again.");
    }
  }

  async function deletePost(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest<void>(`/admin/news/${id}`, {
        method: "DELETE",
      });

      setPosts((current) =>
        current.filter((post) => post.id !== id),
      );

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyPost);
      }

      setMessage("Article deleted.");
    } catch (error) {
      console.error("Failed to delete article:", error);
      setMessage("Unable to delete the article. Please try again.");
    }
  }

  function logout() {
    localStorage.removeItem("sde_admin_authenticated");
    navigate("/admin");
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-kicker">
            SDE CAREER CONNECT
          </span>
          <h1>News Management</h1>
          <p>Private administrator dashboard</p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => navigate("/")}
          >
            View Home
          </button>

          <button
            type="button"
            className="admin-danger-button"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      <section className="admin-applications-dashboard-card">
        <div className="admin-applications-dashboard-icon">
          📋
        </div>

        <div className="admin-applications-dashboard-content">
          <span className="admin-kicker">
            STUDENT SUPPORT
          </span>

          <h2>Student Applications</h2>

          <p>
            View application-support requests submitted by
            students for UR, RP and ALU.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => navigate("/admin/applications")}
        >
          View Applications →
        </button>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-editor-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-kicker">
                CONTENT EDITOR
              </span>
              <h2>
                {editingId === null
                  ? "Create Article"
                  : "Edit Article"}
              </h2>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={startCreate}
            >
              New Article
            </button>
          </div>

          <div className="admin-form-grid">
            <label>
              Article title
              <input
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="Enter article title"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value as NewsCategory,
                  )
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Summary
              <textarea
                value={form.summary}
                onChange={(event) =>
                  updateField("summary", event.target.value)
                }
                placeholder="Short description for the Home page"
                rows={3}
              />
            </label>

            <label>
              Full article content
              <textarea
                value={form.content}
                onChange={(event) =>
                  updateField("content", event.target.value)
                }
                placeholder="Write the complete article here"
                rows={7}
              />
            </label>

            <label>
              Author
              <input
                value={form.author}
                onChange={(event) =>
                  updateField("author", event.target.value)
                }
              />
            </label>

            <label>
              Icon or emoji fallback
              <input
                value={form.icon}
                onChange={(event) =>
                  updateField("icon", event.target.value)
                }
                placeholder="🎓"
              />
            </label>

            <label>
              Main article photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <small>
                Select a JPG, PNG, or WebP image under 2 MB.
              </small>
            </label>

            {form.image && (
              <div className="admin-image-preview">
                <img
                  src={form.image}
                  alt="Main article preview"
                />

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => updateField("image", "")}
                >
                  Remove photo
                </button>
              </div>
            )}

            <label>
              Publication date
              <input
                value={form.date}
                onChange={(event) =>
                  updateField("date", event.target.value)
                }
              />
            </label>

            <label>
              Application link
              <input
                type="url"
                value={form.applicationLink}
                onChange={(event) =>
                  updateField(
                    "applicationLink",
                    event.target.value,
                  )
                }
                placeholder="https://example.com/apply"
              />
              <small>Where students can apply.</small>
            </label>

            <label>
              YouTube application-process link
              <input
                type="url"
                value={form.youtubeLink}
                onChange={(event) =>
                  updateField(
                    "youtubeLink",
                    event.target.value,
                  )
                }
                placeholder="https://youtube.com/watch?v=..."
              />
              <small>
                Video explaining the application process.
              </small>
            </label>

            <label>
              WhatsApp group link
              <input
                type="url"
                value={form.whatsappLink}
                onChange={(event) =>
                  updateField(
                    "whatsappLink",
                    event.target.value,
                  )
                }
                placeholder="https://chat.whatsapp.com/..."
              />
              <small>Student support or community group.</small>
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as NewsStatus,
                  )
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="admin-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField(
                    "featured",
                    event.target.checked,
                  )
                }
              />
              Featured article
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.urgent}
                onChange={(event) =>
                  updateField("urgent", event.target.checked)
                }
              />
              Important update
            </label>
          </div>

          {message && (
            <p className="admin-message" role="status">
              {message}
            </p>
          )}

          <button
            type="button"
            className="admin-primary-button"
            onClick={savePost}
          >
            {editingId === null
              ? "Save Article"
              : "Update Article"}
          </button>
        </div>

        <div className="admin-list-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-kicker">ALL CONTENT</span>
              <h2>Articles</h2>
            </div>

            <strong>{posts.length}</strong>
          </div>

          <div className="admin-article-list">
            {posts.map((post) => (
              <article
                className="admin-article-row"
                key={post.id}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    className="admin-article-thumb"
                  />
                ) : (
                  <div className="admin-article-icon">
                    {post.icon}
                  </div>
                )}

                <div className="admin-article-info">
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  <small>
                    {post.status}
                    {post.featured ? " · Featured" : ""}
                    {post.urgent ? " · Important" : ""}
                  </small>
                </div>

                <div className="admin-article-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => startEdit(post)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-danger-button"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
