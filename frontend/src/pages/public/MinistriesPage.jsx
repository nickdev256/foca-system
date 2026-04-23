import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./MinistriesPage.css";

export default function MinistriesPage() {
  const ministries = [
    {
      name: "Youth Ministry",
      verse: "1 Timothy 4:12",
      desc: "You are not too young. This is where purpose is awakened, identity is built, and a generation rises for Christ.",
    },
    {
      name: "Worship Team",
      verse: "John 4:24",
      desc: "More than music—this is where hearts meet God, where worship becomes an encounter and lives are changed.",
    },
    {
      name: "Media Team",
      verse: "Matthew 28:19",
      desc: "The gospel must reach everywhere. This ministry carries the message of Christ beyond the walls into the world.",
    },
    {
      name: "Prayer Ministry",
      verse: "James 5:16",
      desc: "This is the engine of FOCA. Here, battles are fought and won in the spirit through prayer and intercession.",
    },
  ];

  // Scroll animation
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="page">

      {/* HERO */}
      <section className="ministry-hero">
        <h1>Where Do You Belong?</h1>
        <p>
          You were not created to sit and watch. <br />
          You were created to serve, grow, and walk as a true friend of Christ.
        </p>
      </section>

      {/* STATEMENT */}
      <section className="ministry-statement fade-in">
        <h2>Not Just Church. A Calling.</h2>
        <p>
          FOCA is where spectators become servants, where gifts are awakened,
          and where lives are shaped into true reflections of Christ.
          This is not about filling seats—it’s about raising people.
        </p>
      </section>

      {/* GRID */}
      <div className="ministry-grid fade-in">
        {ministries.map((m, i) => (
          <div className="ministry-card" key={i}>
            <span className="verse">{m.verse}</span>
            <h3>{m.name}</h3>
            <p>{m.desc}</p>

            <Link to="/contact" className="join-btn">
              Step In →
            </Link>
          </div>
        ))}
      </div>

      {/* FINAL */}
      <section className="ministry-final fade-in">
        <h2>You Have a Place Here</h2>
        <p>
          You are not here by accident. There is something inside you that God
          wants to use. FOCA is where it begins.
        </p>

        <Link to="/contact" className="main-btn">
          Start Your Journey
        </Link>
      </section>

    </div>
  );
}