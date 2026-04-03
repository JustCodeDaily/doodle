import "./SubjectPicker.css";
const SUBJECTS = [
  { id: "flower", emoji: "\u{1F338}", label: "Flower" },
  { id: "phone", emoji: "\u{1F4F1}", label: "Phone" },
  { id: "tv", emoji: "\u{1F4FA}", label: "TV" },
  { id: "car", emoji: "\u{1F697}", label: "Car" },
  { id: "bus", emoji: "\u{1F68C}", label: "Bus" },
  { id: "cycle", emoji: "\u{1F6B2}", label: "Cycle" },
];

export default function SubjectPicker({ selected, onSelect }) {
  return (
    <div className="subject-picker">
      <span className="picker-label">Pick your subject</span>
      <div className="picker-row">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            className={`picker-btn ${selected === subject.id ? "active" : ""}`}
            onClick={() => onSelect(subject.id)}
          >
            <span className="picker-emoji">{subject.emoji}</span>
            <span className="picker-text">{subject.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
//

export { SUBJECTS };
