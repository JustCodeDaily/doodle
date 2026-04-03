import { useState, useEffect, useCallback } from "react";
import { useCanvas } from "./hooks/useCanvas";
import SubjectPicker from "./components/SubjectPicker/SubjectPicker";
import DrawingCanvas from "./components/DrawingCanvas/DrawingCanvas";
import ScoreCard from "./components/ScoreCard/ScoreCard";
import LeaderBoard from "./components/LeaderBoard/LeaderBoard";
import Header from "./components/Header";
import "./App.css";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./lib/firebase";
import { scoreWithGemini } from "./lib/gemini";

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
      darkMode ? "dark" : "light",
    );
    localStorage.setItem("jmn-dark-mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(10),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const scores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaderboard(scores);
      },
      (err) => {
        console.error("Firestore listener error:", err);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleScore = async () => {
    if (!name.trim()) {
      setError("Enter your name first!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const base64Image = canvas.exportAsBase64();
      const result = await scoreWithGemini(base64Image, subject);
      setScore(result.score);
      setFeedback(result.feedback);
      setRoast(result.roast);

      // Save to Firebase Leaderboard
      await addDoc(collection(db, "scores"), {
        name: name.trim(),
        subject,
        score: result.score,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app-container">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((prev) => !prev)}
      />

      <main className="app-main">
        <div className="app-left">
          <DrawingCanvas canvas={canvas} />

          <div className="app-footer">
            <SubjectPicker selected={subject} onSelect={setSubject} />

            <div className="footer-action-row">
              <input
                className="name-input"
                type="text"
                placeholder="Your name (e.g. Picasso Jr.)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="score-btn"
                onClick={handleScore}
                disabled={loading}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                Score
              </button>
            </div>
          </div>
        </div>

        <div className="app-right">
          <ScoreCard
            score={score}
            feedback={feedback}
            roast={roast}
            loading={loading}
            error={error}
          />
          <LeaderBoard scores={leaderboard} />
        </div>
      </main>
    </div>
  );
}

export default App;
