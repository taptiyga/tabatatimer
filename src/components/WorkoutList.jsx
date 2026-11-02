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
                    aria-label={`Удалить тренировку «${w.name}»`}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {w.items.length > 0 ? (
                <ul className="workout-preview">
                  {w.items.map((it, i) => {
                    const ex = exercises.find((e) => e.id === it.exerciseId);
                    const label = ex ? ex.name : "—";
                    return (
                      <li key={it.uid || i} className="truncate" title={label}>
                        {label}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="muted small">Упражнения удалены</p>
              )}

              <div className="badges">
                <button
                  className="btn icon-btn"
                  onClick={() => onEdit(w)}
                  title="Редактировать"
                  aria-label={`Редактировать тренировку «${w.name}»`}
                >
                  ✏
                </button>
              </div>

              <div className="actions center">
                <button
                  className="btn primary"
                  onClick={() => onStart(w)}
                  title={`Запустить тренировку «${w.name}»`}
                  aria-label={`Запустить тренировку «${w.name}»`}
                >
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
