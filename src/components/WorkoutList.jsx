export default function WorkoutList({
  workouts,
  exercises,
  onCreate,
  onEdit,
  onDelete,
  onStart,
}) {
  return (
    <div className="list-block">
      <div className="list-header">
        <button
          className="btn primary"
          onClick={onCreate}
          disabled={!exercises.length}
          title={
            !exercises.length
              ? "Сначала создайте упражнение"
              : "Создать тренировку"
          }
        >
          + Создать
        </button>
      </div>

      {!workouts.length ? (
        <p className="muted">Тренировок пока нет.</p>
      ) : (
        <ul className="list">
          {workouts.map((w) => (
            <li key={w.id} className="card">
              <div className="card-head">
                <strong className="truncate" title={w.name}>
                  {w.name}
                </strong>
                <div className="card-head-actions">
                  <span className="muted small">{w.items.length} упр.</span>
                  <button
                    className="btn icon-btn danger"
                    onClick={() => onDelete(w.id)}
                    title="Удалить"
                    aria-label="Удалить тренировку"
                  >
                    🗑
                  </button>
                </div>
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

              <div className="badges">
                <button
                  className="btn icon-btn"
                  onClick={() => onEdit(w)}
                  title="Редактировать"
                  aria-label="Редактировать тренировку"
                >
                  ✏
                </button>
              </div>

              <div className="actions center">
                <button className="btn primary" onClick={() => onStart(w)}>
                  ▶ Старт
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
