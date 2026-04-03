const SUBJECTS = [
  { id: "flower", emoji: "\u{1F338}", label: "Flower" },
  { id: "phone", emoji: "\u{1F4F1}", label: "Phone" },
  { id: "tv", emoji: "\u{1F4FA}", label: "TV" },
  { id: "car", emoji: "\u{1F697}", label: "Car" },
  { id: "bus", emoji: "\u{1F68C}", label: "Bus" },
  { id: "cycle", emoji: "\u{1F6B2}", label: "Cycle" },
];

export default function SubjectPicker() {
  return (
    <>
      {SUBJECTS.map((subject) => (
        <span className="picker-emoji">{subject.label}</span>
      ))}
    </>
  );
}

export { SUBJECTS };
