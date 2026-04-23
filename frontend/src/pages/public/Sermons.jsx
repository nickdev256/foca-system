import { useState } from "react";
import "./Sermons.css";

export default function SermonsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const sermons = [
    {
      title: "Walking in Faith",
      preacher: "Pastor John",
      date: "April 14, 2026",
      category: "Faith",
      thumbnail:
        "https://images.unsplash.com/photo-1507692049790-de58290a4334",
      video: "https://www.youtube.com/embed/ysz5S6PUM-U",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      description:
        "Learn how to trust God in uncertain seasons and walk boldly in faith.",
      verses: ["Hebrews 11:1", "2 Corinthians 5:7"],
      points: [
        "Faith requires trust",
        "God moves even when unseen",
        "Obedience unlocks blessings",
      ],
    },
    {
      title: "Power of Prayer",
      preacher: "Pastor Sarah",
      date: "April 7, 2026",
      category: "Prayer",
      thumbnail:
        "https://images.unsplash.com/photo-1469571486292-b53601010376",
      video: "https://www.youtube.com/embed/ysz5S6PUM-U",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      description: "Discover how prayer transforms lives and situations.",
      verses: ["James 5:16"],
      points: ["Prayer builds intimacy", "Prayer releases power"],
    },
  ];

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.preacher.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sermons-page">

      {/* HERO */}
      <section className="sermons-hero">
        <div className="overlay">
          <h1>Latest Sermons</h1>
          <p>Experience God through powerful teachings</p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Search sermons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* FEATURED */}
      <section className="featured">
        <h2>Featured Sermon</h2>
        <div
          className="featured-card"
          onClick={() => setSelected(sermons[0])}
        >
          <img src={sermons[0].thumbnail} />
          <div>
            <h3>{sermons[0].title}</h3>
            <p>{sermons[0].preacher}</p>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="series">
        <h2>Series</h2>
        <div className="series-row">
          <div className="series-card">Faith Foundations</div>
          <div className="series-card">Power of Prayer</div>
          <div className="series-card">Kingdom Living</div>
        </div>
      </section>

      {/* GRID */}
      <section className="sermons-container">
        {filtered.map((s, i) => (
          <div
            className="sermon-card"
            key={i}
            onClick={() => setSelected(s)}
          >
            <img src={s.thumbnail} alt="" />
            <div className="sermon-content">
              <span>{s.date}</span>
              <h3>{s.title}</h3>
              <p>{s.preacher}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 🔥 INLINE DETAILS */}
      {selected && (
        <section className="sermon-details-inline">

          <button className="close-btn" onClick={() => setSelected(null)}>
            ✕ Close
          </button>

          {/* VIDEO */}
          <iframe
            src={selected.video}
            title=""
            allowFullScreen
          ></iframe>

          {/* CONTENT */}
          <div className="details-content">
            <h2>{selected.title}</h2>
            <p className="meta">
              {selected.preacher} • {selected.date}
            </p>

            <div className="block">
              <h3>Message Summary</h3>
              <p>{selected.description}</p>
            </div>

            <div className="block">
              <h3>Bible Verses</h3>
              <ul>
                {selected.verses.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>

            <div className="block">
              <h3>Key Points</h3>
              <ul>
                {selected.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="block">
              <h3>Listen (Audio)</h3>
              <audio controls src={selected.audio}></audio>
            </div>

            <div className="block downloads">
              <button>Download Audio</button>
              <button>Download Notes</button>
            </div>

          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sermon-cta">
        <h2>Stay Connected</h2>
        <p>Get weekly sermons directly</p>
        <div className="cta-form">
          <input placeholder="Enter email" />
          <button>Subscribe</button>
        </div>
      </section>

    </div>
  );
}