export default function ExerciseList({ exercises, onEdit, onDelete, onStart }) {
  if (!exercises.length) {
    return <p className="muted">Упражнений пока нет. Создайте первое!</p>;
  }

  return (
    <ul className="list">
      {exercises.map((ex) => (
        <li key={ex.id} className="card">
          <div className="card-head">
            <strong>{ex.name}</strong>
          </div>
          {ex.description && <p className="muted small">{ex.description}</p>}
          <div className="badges">
            <span>⏱ подготовка {ex.prepare}с</span>
            <span>💪 {ex.exercise}с</span>
            <span>😮‍💨 отдых {ex.rest}с</span>
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
