import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    fetch("https://pixie-event-scraper.onrender.com/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setEvents(data.events);
        setStats(data.stats);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const downloadExcel = () => {
    
    window.open("https://pixie-event-scraper.onrender.com/surat_events.xlsx")
  };

  
const filteredEvents = events.filter(e => 
  e && e.title && e.title.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="container">
      <header>
        <h1>🎭 Pixie Event Tracker</h1>
        <p className="subtitle">Real-time Event Discovery & Analytics (Surat)</p>
      </header>

      {/* --- ANALYTICS SECTION --- */}
      <div className="analytics-grid">
        <div className="stat-card">
          <span>Total Discovered</span>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat-card active">
          <span>Active Events</span>
          <h2>{stats.active}</h2>
        </div>
        <div className="stat-card sync">
          <span>Last Sync</span>
          <p>{stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Never'}</p>
        </div>
      </div>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search for workshops, comedy, music..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button className="download-btn" onClick={downloadExcel}>
          ⬇ Sync to Excel
        </button>
      </div>

      {loading ? (
        <div className="loader">Fetching latest events...</div>
      ) : (
        <div className="grid">
          {filteredEvents.map((e, i) => (
            <div className={`card ${e.status === 'expired' ? 'expired' : ''}`} key={i}>
              <div className="status-tag">{e.status}</div>
              <h3>{e.title}</h3>
              <p>📍 {e.city.toUpperCase()}</p>
              <a href={e.url} target="_blank" rel="noreferrer">
                View on BookMyShow →
              </a>
            </div>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="no-results">No events found matching your search.</div>
      )}
    </div>
  );
}

export default App;
