import { useState, useEffect } from "react";
import { useCanvas } from "./hooks/useCanvas";
import SubjectPicker from "./components/SubjectPicker/SubjectPicker";
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas";
import ScoreCard from "./components/ScoreCard/ScoreCard";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  const canvas = useCanvas(600, 400);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("flower");
  const [score, setScore] = useState(null); // AI score (1-10)
  const [leaderboard, setLeaderboard] = useState([]);
  const [feedback, setFeedback] = useState(null); // Encouraging line
  const [roast, setRoast] = useState(null); // Savage line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("jmn-dark-mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "light" : "light",
    );
    localStorage.setItem("jmn-dark-mode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="app-Container">
      {/* <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((prev) => !prev)}
      /> */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px" }}>
        <DrawingCanvas canvas={canvas} />
        <input
          type="text"
          placeholder="Your name (e.g. Picasso Jr.)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SubjectPicker selected={subject} onSelect={setSubject} />
        <button onClick={() => alert("Gemini scoring coming in Phase 3!")}>
          Judge my noodle
        </button>
      </div>
      <div className="app-right">
        <ScoreCard
          score={score}
          feedback={feedback}
          roast={roast}
          loading={loading}
          error={error}
        />

        {/* Live leaderboard */}
        <Leaderboard scores={leaderboard} />
      </div>
    </div>
  );
}

export default App;
