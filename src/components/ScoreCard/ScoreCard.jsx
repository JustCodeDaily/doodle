import "./ScoreCard.styles.css";

function getScoreColor(score) {
  if (score >= 7) return "var(--color-score-high)";
  if (score >= 4) return "var(--color-score-mid)";
  return "var(--color-score-low)";
}

export default function ScoreCard({ score, feedback, roast, loading, error }) {
  return (
    <div className="score-card card">
      <div className="sc-label">Score</div>

      {loading && (
        <div className="sc-loading">
          <div className="sc-spinner" />
          <p className="sc-loading-text">
            The judge is squinting at your art...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="sc-error">
          <p className="sc-error-text">{error}</p>
        </div>
      )}

      {score !== null && !loading && !error && (
        <div className="sc-result">
          <div className="sc-score" style={{ color: getScoreColor(score) }}>
            {score}
            <span className="sc-max">/10</span>
          </div>
          {feedback && <p className="sc-feedback">{feedback}</p>}
          {roast && <p className="sc-roast">"{roast}"</p>}
        </div>
      )}

      {score === null && !loading && !error && (
        <div className="sc-empty">
          <p className="sc-empty-text">
            Draw something and hit
            <br />
            "Judge my noodle" to get scored!
          </p>
        </div>
      )}
    </div>
  );
}
