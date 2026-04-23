import { Link } from "react-router-dom";
import "./Events.css";

export default function EventsPage() {
  const events = [
    {
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "8:00 AM - 11:00 AM",
      location: "FOCA Kyanja",
    },
    {
      title: "Youth Fellowship",
      date: "Friday",
      time: "5:00 PM",
      location: "Church Hall",
    },
    {
      title: "Prayer Night",
      date: "Last Friday of Month",
      time: "9:00 PM",
      location: "Main Sanctuary",
    },
  ];

  return (
    <div className="page events">

      <section className="section">
        <h2>Events</h2>
        <p>Join us in worship, fellowship, and growth.</p>
      </section>

      <div className="event-grid">
        {events.map((e, i) => (
          <div className="event-card" key={i}>

            <h3>{e.title}</h3>
            <p><strong>Date:</strong> {e.date}</p>
            <p><strong>Time:</strong> {e.time}</p>
            <p><strong>Location:</strong> {e.location}</p>

            <Link to="/contact" className="btn small">
              Attend →
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}