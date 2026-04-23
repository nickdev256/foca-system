import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import EntityModule from '../../components/common/EntityModule';
import api from "../../services/api";
import './SermonsPage.css';

export default function SermonsPage() {
  const { user } = useAuth();

  const [sermons, setSermons] = useState([]);
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState("");
  const [search, setSearch] = useState("");

  // 🔥 NEW STATES
  const [fileType, setFileType] = useState("ppt");
  const [file, setFile] = useState(null);

  /* =========================
     LOAD SERMONS
  ========================= */
  const loadSermons = async () => {
    try {
      const res = await api.get("/sermons");
      setSermons(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSermons();
  }, []);

  /* =========================
     AI GENERATE (PASTOR)
  ========================= */
  const generateSlides = async () => {
  try {
    const res = await api.post(
      "/ai/sermon-slides",
      {
        topic,
        type: fileType,
      },
      {
        responseType: "blob",
      }
    );

    // ✅ CHECK IF RESPONSE IS ACTUALLY AN ERROR (JSON)
    const contentType = res.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      const text = await res.data.text();
      const error = JSON.parse(text);
      throw new Error(error.message || "AI failed");
    }

    // ✅ DOWNLOAD FILE
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic || "sermon"}.${fileType}`;
    a.click();

  } catch (err) {
    console.error("🔥 FRONTEND ERROR:", err);
    alert(err.message || "Failed to generate file");
  }
};
  /* =========================
     DOWNLOAD AI FILE
  ========================= */
  const downloadGenerated = () => {
    const blob = new Blob([slides], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic || "sermon"}.${fileType}`;
    a.click();
  };

  /* =========================
     SAVE AI SERMON
  ========================= */
  const saveGenerated = async () => {
    try {
      await api.post("/sermons", {
        title: topic,
        speaker: user?.name,
        description: slides,
        category: "AI Generated",
        status: "draft",
      });

      alert("Sermon saved");
      setSlides("");
      setTopic("");
      loadSermons();
    } catch (err) {
      alert("Failed to save sermon");
    }
  };

  /* =========================
     FILE UPLOAD
  ========================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", topic || "Uploaded Sermon");
    formData.append("speaker", user?.name);
    formData.append("file", file);

    try {
      await api.post("/sermons/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully");
      setFile(null);
      loadSermons();
    } catch (err) {
      alert("Upload failed");
    }
  };

  /* =========================
     FILTER (MEMBER)
  ========================= */
  const filtered = useMemo(() => {
    return sermons.filter(s =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, sermons]);

  return (
    <div className="sermons-page">

      {/* HERO */}
      <section className="sermons-hero">
        <div className="sermons-hero-text">
          <span className="sermons-badge">FOCA Connect</span>
          <h1>Sermons & Media</h1>
          <p>Experience, manage and grow through sermons</p>
        </div>
      </section>

      {/* =========================
          🎬 MEDIA VIEW
      ========================= */}
      {(user?.role === "media") && (
        <section className="sermons-module-section">
          <h2>🎬 Media Management</h2>

          <EntityModule
            endpoint="/sermons"
            title="Sermon"
            fields={[
              { name: 'title', label: 'Title' },
              { name: 'speaker', label: 'Speaker' },
              { name: 'category', label: 'Category' },
              { name: 'videoUrl', label: 'YouTube URL' },
              { name: 'slidesUrl', label: 'Slides URL' },
              { name: 'thumbnail', label: 'Thumbnail URL' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' }
                ]
              },
              {
                name: 'featured',
                label: 'Featured',
                type: 'select',
                options: [
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' }
                ]
              },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
        </section>
      )}

      {/* =========================
          👨‍💼 PASTOR VIEW
      ========================= */}
      {(user?.role === "pastor") && (
        <section className="pastor-sermon-tools">

          <h2>👨‍💼 Pastor Tools</h2>

          {/* AI BUILDER */}
          <div className="ai-box">
            <h3>🧠 AI Sermon Builder</h3>

            <input
              placeholder="Enter sermon topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            {/* 🔥 FILE TYPE SELECT */}
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="ppt">PowerPoint</option>
              <option value="doc">Word</option>
              <option value="xls">Excel</option>
              <option value="pdf">PDF</option>
            </select>

            <button onClick={generateSlides}>
              Generate Slides
            </button>

            {slides && (
              <>
                <pre className="slides-output">{slides}</pre>

                <button onClick={downloadGenerated}>
                  Download File
                </button>

                <button onClick={saveGenerated}>
                  Save Sermon
                </button>
              </>
            )}
          </div>

          {/* 🔥 FILE UPLOAD */}
          <div className="upload-box">
            <h3>Upload File (PPT, PDF, Word, Excel)</h3>

            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button type="submit">Upload File</button>
            </form>
          </div>

          {/* EXISTING MODULE */}
          <div className="upload-box">
            <h3>Upload or Manage Sermons</h3>

            <EntityModule
              endpoint="/sermons"
              title="My Sermon"
              fields={[
                { name: 'title', label: 'Title' },
                { name: 'speaker', label: 'Speaker' },
                { name: 'category', label: 'Category' },
                { name: 'videoUrl', label: 'Video URL' },
                { name: 'slidesUrl', label: 'Slides URL' },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { value: 'draft', label: 'Draft' },
                    { value: 'preached', label: 'Preached' }
                  ]
                },
                { name: 'description', label: 'Notes', type: 'textarea' },
              ]}
            />
          </div>

        </section>
      )}

      {/* =========================
          👤 MEMBER VIEW
      ========================= */}
      {(user?.role === "member") && (
        <section className="sermon-grid">

          <h2>🎬 Watch Sermons</h2>

          <input
            className="search-bar"
            placeholder="Search sermons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 ? (
            <p>No sermons available</p>
          ) : (
            filtered.map((s) => (
              <div key={s._id} className="sermon-card">

                {s.thumbnail && (
                  <img src={s.thumbnail} alt={s.title} />
                )}

                {s.videoUrl && (
                  <iframe src={s.videoUrl} title={s.title} allowFullScreen />
                )}

                <h3>{s.title}</h3>
                <p>{s.speaker}</p>
                <small>{s.category}</small>

                {/* 🔥 FILE DOWNLOAD */}
                {s.fileUrl && (
                  <a
                    href={`http://localhost:5000${s.fileUrl}`}
                    target="_blank"
                  >
                    📥 Download File
                  </a>
                )}

                {/* OLD SUPPORT */}
                {s.slidesUrl && (
                  <a href={s.slidesUrl} target="_blank">
                    📄 View Slides
                  </a>
                )}

              </div>
            ))
          )}

        </section>
      )}

    </div>
  );
}