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
            <strong className="truncate" title={w.name}>
              {w.name}
            </strong>
            <span className="muted small">{w.items.length} упражнений</span>
          </div>
          <ul className="workout-preview">
            {w.items.map((it, i) => {
              const ex = exercises.find((e) => e.id === it.exerciseId);
              const label = ex ? ex.name : "—";
              return (
                <li key={i} className="truncate" title={label}>
                  {label}
                </li>
              );
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
