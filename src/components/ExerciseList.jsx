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
                  if (e.target !== e.currentTarget) return;
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
                  <div className="card-head-actions">
                    {hasDescription && (
                      <span
                        className={`expand-chevron ${isOpen ? "open" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(ex.id);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggle(ex.id);
                          }
                        }}
                        aria-label={isOpen ? "Свернуть" : "Развернуть"}
                      >
                        ▾
                      </span>
                    )}
                    <button
                      className="btn icon-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ex.id);
                      }}
                      title="Удалить"
                      aria-label="Удалить упражнение"
                    >
                      🗑
                    </button>
                  </div>
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
                  <button
                    className="btn icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(ex);
                    }}
                    title="Редактировать"
                    aria-label="Редактировать упражнение"
                  >
                    ✏
                  </button>
                </div>

                <div className="actions center">
                  <button
                    className="btn primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStart(ex);
                    }}
                  >
                    ▶ Старт
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
