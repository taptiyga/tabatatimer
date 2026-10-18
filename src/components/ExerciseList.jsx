import { fmtShort } from "../utils/format";

export default function ExerciseList({ exercises, onEdit, onDelete, onStart }) {
  if (!exercises.length) {
    return <p className="muted">Упражнений пока нет. Создайте первое!</p>;
  }

  return (
    <ul className="list">
      {exercises.map((ex) => (
        <li key={ex.id} className="card">
          <div className="card-head">
            <strong className="truncate" title={ex.name}>
              {ex.name}
            </strong>
          </div>
          {ex.description && (
            <p className="muted small truncate" title={ex.description}>
              {ex.description}
            </p>
          )}
          <div className="badges">
            <span>⏱ {fmtShort(ex.prepare)}</span>
            <span>💪 {fmtShort(ex.exercise)}</span>
            <span>😮‍💨 {fmtShort(ex.rest)}</span>
            <span>🔁 {ex.rounds}</span>
          </div>
          <div className="actions">
            <button className="btn primary" onClick={() => onStart(ex)}>
              ▶ Старт
            </button>
            <button className="btn" onClick={() => onEdit(ex)}>
              ✏
            </button>
            <button className="btn danger" onClick={() => onDelete(ex.id)}>
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
