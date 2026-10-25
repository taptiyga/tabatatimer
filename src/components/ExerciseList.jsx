import { useState } from "react";
import { fmtShort } from "../utils/format";

export default function ExerciseList({
  exercises,
  onCreate,
  onEdit,
  onDelete,
  onStart,
}) {
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="list-block">
      <div className="list-header">
        <h3 className="list-title">Упражнения</h3>
        <button className="btn primary" onClick={onCreate}>
          + Создать
        </button>
      </div>

      {!exercises.length ? (
        <p className="muted">Упражнений пока нет. Создайте первое!</p>
      ) : (
        <ul className="list">
          {exercises.map((ex) => {
            const isOpen = expanded.has(ex.id);
            const hasDescription = !!ex.description?.trim();

            return (
              <li
                key={ex.id}
                className={`card exercise-card ${isOpen ? "expanded" : ""} ${
                  hasDescription ? "clickable" : ""
                }`}
                onClick={() => hasDescription && toggle(ex.id)}
                role={hasDescription ? "button" : undefined}
                tabIndex={hasDescription ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!hasDescription) return;
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle(ex.id);
                  }
                }}
                aria-expanded={hasDescription ? isOpen : undefined}
              >
                <div className="card-head">
                  <strong className="truncate" title={ex.name}>
                    {ex.name}
                  </strong>
                  {hasDescription && (
                    <span className={`expand-chevron ${isOpen ? "open" : ""}`}>
                      ▾
                    </span>
                  )}
                </div>

                {hasDescription && (
                  <p
                    className={`muted small exercise-desc ${isOpen ? "open" : ""}`}
                  >
                    {ex.description}
                  </p>
                )}

                <div className="badges">
                  <span>⏱ {fmtShort(ex.prepare)}</span>
                  <span>💪 {fmtShort(ex.exercise)}</span>
                  <span>😮‍💨 {fmtShort(ex.rest)}</span>
                  <span>🔁 {ex.rounds}</span>
                </div>

                <div className="actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn primary" onClick={() => onStart(ex)}>
                    ▶ Старт
                  </button>
                  <button className="btn" onClick={() => onEdit(ex)}>
                    ✏
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => onDelete(ex.id)}
                  >
                    🗑
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
