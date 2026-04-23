import { useState } from "react";
import "./AboutPage.css";

// IMAGES
import heroImg from "../../assets/images/hero.jpg";
import worshipImg from "../../assets/images/worship.jpg";
import bibleImg from "../../assets/images/bible.jpg";
import logoImg from "../../assets/images/logo.jpg";

import leader1 from "../../assets/images/leader1.jpg";
import leader2 from "../../assets/images/leader2.jpg";
import leader3 from "../../assets/images/leader3.jpg";
import leader4 from "../../assets/images/leader4.jpg";

const leaders = [
  {
    id: 1,
    name: "Pastor Nick",
    role: "Senior Pastor",
    img: leader1,
    bio: "Pastor Nick leads FOCA with a vision to transform lives through the Word of God. He is passionate about raising a generation grounded in faith, purpose, and spiritual growth.",
  },
  {
    id: 2,
    name: "David",
    role: "Associate Pastor",
    img: leader2,
    bio: "David supports the ministry through teaching and discipleship. He focuses on equipping believers to grow deeper in their relationship with Christ.",
  },
  {
    id: 3,
    name: "Samuel",
    role: "Elder",
    img: leader3,
    bio: "Samuel provides spiritual guidance and leadership within the church, helping to strengthen the faith and unity of the FOCA family.",
  },
  {
    id: 4,
    name: "Grace",
    role: "Worship Leader",
    img: leader4,
    bio: "Grace leads worship with passion, creating an atmosphere where people can encounter God through praise and deep spiritual connection.",
  },
];

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const getClass = (index) => {
    const diff = index - activeIndex;

    if (diff === 0) return "active";
    if (diff === -1 || diff === leaders.length - 1) return "left";
    if (diff === 1 || diff === -leaders.length + 1) return "right";

    return "hidden";
  };

  return (
    <div className="about">

      {/* HERO */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="overlay">
          <div className="hero-content">

            <span className="hero-tag"></span>

            <h1>
              Building Lives <br />
              Through Christ
            </h1>

            <p>
              Bringing people into the life, family, and purpose of God —
              raising a generation rooted in faith, love, and impact.
            </p>

          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section container two-col">
        <div>
          <h2>Who We Are</h2>
          <p>
            Friends of Christ Assembly (FOCA) is a Christ-centered church
            dedicated to transforming lives through worship, teaching,
            and community. We are a family where faith grows and purpose is discovered.
          </p>
        </div>

        <div className="image-stack">
          <img src={logoImg} alt="FOCA logo" className="logo-overlay" />
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section
        className="dark-section"
        style={{ backgroundImage: `url(${worshipImg})` }}
      >
        <div className="overlay">
          <div className="content">

            <span className="section-tag">VISIT FOCA</span>

            <h2>What to Expect</h2>

            <p>
              Expect powerful worship, practical teaching, and a welcoming
              environment. Whether it’s your first time or you’ve been coming
              for years, there’s a place for you here.
            </p>

            <div className="expect-grid">
              <div>🙏 Spirit-filled Worship</div>
              <div>📖 Practical Teaching</div>
              <div>🤝 Friendly Community</div>
            </div>

            <button className="expect-btn">Plan Your Visit</button>

          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section container values">
        <h2>Our Core Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="icon">✝️</div>
            <h4>Faith</h4>
            <p>We trust in God fully and live by His Word daily.</p>
          </div>

          <div className="value-card">
            <div className="icon">❤️</div>
            <h4>Love</h4>
            <p>We reflect Christ’s love through compassion and unity.</p>
          </div>

          <div className="value-card">
            <div className="icon">🛡️</div>
            <h4>Integrity</h4>
            <p>We walk in truth, honesty, and righteousness.</p>
          </div>

          <div className="value-card">
            <div className="icon">🤝</div>
            <h4>Service</h4>
            <p>We serve God and people with humility and purpose.</p>
          </div>
        </div>
      </section>

      {/* BELIEFS */}
      <section className="section container two-col">
        <div>
          <h2>What We Believe</h2>
          <p>
            We believe in Jesus Christ as Lord and Savior, the authority of the
            Word of God, and the transforming power of the Holy Spirit.
          </p>
        </div>
        <img src={bibleImg} alt="Bible and faith" />
      </section>

      {/* MINISTRIES */}
      <section className="section container">
        <h2>What We Do</h2>

        <div className="grid-3">
          <div className="card"><h4>Evangelism</h4><p>We reach out to win souls and bring people into Christ.</p></div>
          <div className="card"><h4>Discipleship</h4><p>We equip believers through teaching and spiritual growth.</p></div>
          <div className="card"><h4>Service & Impact</h4><p>We release people to serve God and impact their communities.</p></div>
          <div className="card"><h4>Worship & Prayer</h4><p>We create an atmosphere for encountering God deeply.</p></div>
          <div className="card"><h4>Youth Ministry</h4><p>We raise a strong, purpose-driven young generation.</p></div>
          <div className="card"><h4>Community Fellowship</h4><p>We build a family where people belong and grow together.</p></div>
        </div>

        <div className="ministries-cta">
          <p>Find your place and grow with us.</p>
          <button className="cta-btn">Serve With Us</button>
        </div>
      </section>

      {/* 🔥 LEADERS */}
      <section className="leaders">
        <h2>Leadership Team</h2>

        <div className="carousel">
          {leaders.map((l, index) => (
            <div
              key={l.id}
              className={`carousel-card ${getClass(index)}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={l.img} alt={l.name} />
              <h4>{l.name}</h4>
              <p>{l.role}</p>
            </div>
          ))}
        </div>

        {/* 🔥 UPDATED CONTENT */}
        <div className="leader-content">
          <h3>{leaders[activeIndex].name}</h3>
          <span className="leader-role">
            {leaders[activeIndex].role}
          </span>
          <p>{leaders[activeIndex].bio}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Join Us This Sunday</h2>
        <p>Kampala, Uganda | 9AM & 11AM</p>
        <button>Visit Us</button>
      </section>

    </div>
  );
}