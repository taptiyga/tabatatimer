export default function WorkoutList({
  workouts,
  exercises,
  onEdit,
  onDelete,
  onStart,
}) {
  if (!workouts.length) {
    return <p className="muted">Тренировок пока нет.</p>;
  }

  return (
    <ul className="list">
      {workouts.map((w) => (
        <li key={w.id} className="card">
          <div className="card-head">
            <strong>{w.name}</strong>
            <span className="muted small">{w.items.length} упражнений</span>
          </div>
          <ul className="workout-preview">
            {w.items.map((it, i) => {
              const ex = exercises.find((e) => e.id === it.exerciseId);
              return <li key={i}>{ex ? ex.name : "—"}</li>;
            })}
          </ul>
          <div className="actions">
            <button className="btn primary" onClick={() => onStart(w)}>
              ▶ Старт
            </button>
            <button className="btn" onClick={() => onEdit(w)}>
              ✏
            </button>
            <button className="btn danger" onClick={() => onDelete(w.id)}>
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
