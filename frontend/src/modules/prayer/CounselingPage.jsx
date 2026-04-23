import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import EntityModule from "../../components/common/EntityModule";
import "./CounselingPage.css";

export default function CounselingPage() {
  const [privateMode, setPrivateMode] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);

        const res = await api.get("/counseling");

        setSessions(res.data || []);
        setError("");
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load counseling sessions"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "open";
      case "ongoing":
        return "ongoing";
      case "closed":
        return "closed";
      default:
        return "pending";
    }
  };

  return (
    <div className="counseling-page">

      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* HERO */}
      <section className="counseling-hero">

        <div className="counseling-hero-text">
          <span className="counseling-badge">FOCA Connect</span>

          <h1>Counseling Management</h1>

          <p>
            Manage pastoral counseling sessions, member care, follow-ups, and
            confidential notes in one secure system.
          </p>

          <div className="status-chips">
            <span className="chip open">Open</span>
            <span className="chip ongoing">Ongoing</span>
            <span className="chip closed">Closed</span>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={privateMode}
              onChange={() => setPrivateMode(!privateMode)}
            />
            Private Counseling Mode 🔒
          </label>
        </div>

      </section>

      {/* SESSION LIST */}
      <section className="session-list-section">

        <h2>📅 Counseling Sessions</h2>

        {loading && <p>Loading sessions...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && sessions.length === 0 && (
          <p>No counseling sessions found.</p>
        )}

        <div className="session-list">
          {sessions.map((s) => (
            <div key={s._id} className="session-card">

              <div>
                <h4>{s.memberName}</h4>
                <p>{s.topic}</p>

                <small>
                  Follow-up:{" "}
                  {s.followUpDate
                    ? new Date(s.followUpDate).toLocaleDateString()
                    : "Not set"}
                </small>
              </div>

              <span className={`status ${getStatusClass(s.status)}`}>
                {s.status || "pending"}
              </span>

            </div>
          ))}
        </div>

      </section>

      {/* FORM */}
      <section className="counseling-module-section">

        <h2>New Counseling Session</h2>

        <EntityModule
          endpoint="/counseling"
          title="Counseling Session"
          fields={[
            { name: "memberName", label: "Member Name" },
            { name: "topic", label: "Topic" },

            {
              name: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Open", value: "open" },
                { label: "Ongoing", value: "ongoing" },
                { label: "Closed", value: "closed" }
              ]
            },

            {
              name: "notes",
              label: privateMode
                ? "Encrypted Notes 🔒 (Visible to Pastor Only)"
                : "Notes",
              type: "textarea"
            },

            {
              name: "followUpDate",
              label: "Follow-up Date",
              type: "date"
            }
          ]}
        />

      </section>

    </div>
  );
}