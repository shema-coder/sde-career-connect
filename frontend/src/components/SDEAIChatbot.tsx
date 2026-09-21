import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const QUICK_ACTIONS = [
  "What can SDE Career Connect help me with?",
  "I don't know what to study.",
  "I am a TSS/TVET student. What can I study?",
  "Help me find scholarships.",
];

export default function SDEAIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I’m SDE AI. I can help you explore university options, scholarships, study opportunities, Opportunity Finder, Application Support, and application safety.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(customMessage?: string) {
    const text = (customMessage ?? message).trim();

    if (!text || loading) return;

    setMessage("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "SDE AI is temporarily unavailable.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data?.response ||
            "I could not generate a response right now. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to SDE AI right now. Please try again in a moment.",
        },
      ]);

      console.error("SDE AI error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <>
      {open && (
        <section className="sde-ai-chatbot" aria-label="SDE AI Assistant">
          <header className="sde-ai-header">
            <div className="sde-ai-brand">
              <div className="sde-ai-avatar">✦</div>

              <div>
                <strong>SDE AI</strong>
                <span>
                  <i /> Online student assistant
                </span>
              </div>
            </div>

            <button
              type="button"
              className="sde-ai-close"
              onClick={() => setOpen(false)}
              aria-label="Close SDE AI"
            >
              ×
            </button>
          </header>

          <div className="sde-ai-messages">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`sde-ai-message-row ${
                  item.role === "user"
                    ? "sde-ai-message-user"
                    : "sde-ai-message-assistant"
                }`}
              >
                <div className="sde-ai-message">
                  {item.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.content
                        .replace(/\\\\\*\\\\\*/g, "**")
                        .replace(/\\\\\*/g, "*")}
                    </ReactMarkdown>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="sde-ai-quick-actions">
                <span>Quick questions</span>

                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => void sendMessage(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="sde-ai-message-row sde-ai-message-assistant">
                <div className="sde-ai-message sde-ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="sde-ai-input-area" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask SDE AI anything..."
              maxLength={4000}
              disabled={loading}
              aria-label="Ask SDE AI"
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>

          <div className="sde-ai-disclaimer">
            SDE AI provides guidance only. Always verify admissions,
            deadlines and eligibility with official sources.
          </div>
        </section>
      )}

      <button
        type="button"
        className={`sde-ai-floating-button ${
          open ? "sde-ai-floating-button-open" : ""
        }`}
        onClick={() => setOpen((previous) => !previous)}
        aria-label={open ? "Close SDE AI" : "Open SDE AI"}
      >
        {open ? "×" : "✦"}
        {!open && <span>Ask SDE AI</span>}
      </button>
    </>
  );
}
