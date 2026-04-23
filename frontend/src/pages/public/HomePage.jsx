import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

// IMAGES
import worshipImg from "../../assets/images/worship1w.jpg";
import youthImg from "../../assets/images/youth.jpg";
import pastorImg from "../../assets/images/pastor.jpg";
import sermonImg from "../../assets/images/sermon.png";

export default function HomePage() {
  const [data, setData] = useState(null);

  const images = [worshipImg, youthImg, pastorImg];
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 ROTATE IMAGES EVERY 15s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 KEEP SAME DESIGN BUT SWITCH POSITIONS
  const getClass = (i) => {
    if (activeIndex === i) return "img-2"; // center
    if ((activeIndex + 1) % 3 === i) return "img-3"; // right
    return "img-1"; // left
  };

  useEffect(() => {
    setData({
      hero: {
        description:
          "A Christ-centered church committed to raising disciples, nurturing spiritual growth, and transforming lives through the power of God.",
      },

      steps: [
        {
          title: "Sunday Worship Experience",
          desc: "Join us for powerful worship, the Word, and fellowship every Sunday.",
          link: "/visit",
        },
        {
          title: "Prayer & Counseling",
          desc: "Submit your prayer requests and receive spiritual guidance.",
          link: "/prayer",
        },
        {
          title: "Sermons & Teachings",
          desc: "Grow deeper through life-transforming messages.",
          link: "/sermons",
        },
      ],

      values: [
        { title: "Worship & Presence", desc: "We prioritize God's presence." },
        { title: "Biblical Teaching", desc: "Rooted in sound doctrine." },
        { title: "Discipleship", desc: "We raise believers." },
        { title: "Love & Community", desc: "We build a church family." },
      ],
    });
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="homepage">

      {/* HERO */}
      <section className="hero">
        <div className="hero-container">

          {/* LEFT */}
          <div className="hero-left">
            <p className="hero-tag">FOCA • Kyanja</p>

            <h1>
              Discover Your <br />
              <span>Faith Journey</span>
            </h1>

            <p className="hero-desc">{data.hero.description}</p>

            <div className="hero-buttons">
              <Link to="/visit" className="btn-primary">Plan Your Visit</Link>
              <Link to="/sermons" className="btn-glass">Watch Sermons</Link>
            </div>

            <div className="hero-features">
              <span>🙏 Worship</span>
              <span>📖 Word</span>
              <span>👥 Discipleship</span>
            </div>
          </div>

          {/* RIGHT (MODERN IMAGES) */}
          <div className="hero-right modern">

            {/* BLOBS */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            {[0, 1, 2].map((i) => (
              <div key={i} className={`img-card ${getClass(i)}`}>
                <img src={images[i]} alt="" />
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* STEPS */}
<section className="steps">
  <div className="steps-header">
    <p className="steps-sub">MINISTRY & SERVICES</p>
    <h2>Our Church Services</h2>
  </div>

  <div className="steps-grid">
    {data.steps.map((item, i) => (
      <Link to={item.link} key={i} className="step-card">

        <img
          src={i === 0 ? worshipImg : i === 1 ? youthImg : sermonImg}
          alt={item.title}
        />

        <div className="overlay">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>

      </Link>
    ))}
  </div>
</section>

  {/* VALUES */}
<section className="values">
  <div className="values-header">
    <p className="values-sub">OUR FOUNDATION</p>
    <h2>Our Calling & Identity</h2>
  </div>

  <div className="values-grid">
    {data.values.map((v, i) => (
      <div key={i} className="value-card">

        <div className="value-inner">

          {/* FRONT */}
          <div className="value-front">
            <div className="value-light"></div>

            <div className="value-icon">
              {i === 0 && "🙏"}
              {i === 1 && "📖"}
              {i === 2 && "🕊️"}
              {i === 3 && "❤️"}
            </div>

            <h3>{v.title}</h3>
            <p>{v.desc}</p>

            <div className="value-divider"></div>
          </div>

          {/* BACK (SCRIPTURE) */}
          <div className="value-back">
            {i === 0 && (
              <>
                <h4>John 4:24</h4>
                <p>
                  "God is spirit, and His worshipers must worship in the Spirit and in truth."
                </p>
              </>
            )}

            {i === 1 && (
              <>
                <h4>2 Timothy 3:16</h4>
                <p>
                  "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training."
                </p>
              </>
            )}

            {i === 2 && (
              <>
                <h4>Matthew 28:19</h4>
                <p>
                  "Go and make disciples of all nations..."
                </p>
              </>
            )}

            {i === 3 && (
              <>
                <h4>John 13:34</h4>
                <p>
                  "Love one another. As I have loved you, so you must love one another."
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    ))}
  </div>
</section>
 {/* CTA */}
<section className="cta">
  <div className="cta-content">

    <p className="cta-sub">YOU ARE WELCOME</p>

    <h2>Find Your Place at FOCA</h2>

    <p className="cta-text">
      Whether you're new to faith or looking for a church home, there’s a place for you here. 
      Join us this Sunday and encounter God in a real and powerful way.
    </p>

    <div className="cta-actions">
      <Link to="/visit" className="btn-primary">Plan Your Visit</Link>
      <Link to="/prayer" className="btn-secondary">Send Prayer Request</Link>
    </div>

  </div>

  <div className="cta-light"></div>
</section>
    </div>
  );
}