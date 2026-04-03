import { SUBJECTS } from "../SubjectPicker/SubjectPicker";

function getSubjectEmoji(subjectId) {
  const found = SUBJECTS.find((s) => s.id === subjectId);
  return found ? found.emoji : "✏️";
}

function getRankClass(index) {
  if (index === 0) return "rank-gold";
  if (index === 1) return "rank-silver";
  if (index === 2) return "rank-bronze";
  return "";
}

export default function LeaderBoard({ scores }) {
  return (
    <div className="leaderboard card">
      <div className="lb-header">
        <span className="lb-title">Leaderboard</span>
        <span className="lb-live">
          <span className="lb-live-dot" />
          Live
        </span>
      </div>

      {/* ---- Score Rows ---- */}
      {scores.length === 0 ? (
        // Empty state — no scores yet
        <p className="lb-empty">No scores yet. Be the first!</p>
      ) : (
        <div className="lb-list">
          {scores.map((entry, index) => (
            // Each row shows: rank | name | subject emoji | score
            <div key={entry.id || index} className="lb-row">
              {/* Rank number with medal styling for top 3 */}
              <span className={`lb-rank ${getRankClass(index)}`}>
                {index + 1}
              </span>

              <span className="lb-name">{entry.name}</span>
              <span className="lb-subject">
                {getSubjectEmoji(entry.subject)}
              </span>
              <span className="lb-score">{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
