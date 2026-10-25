import { useState } from "react";
import FormModal from "./FormModal";

export default function WorkoutForm({
  exercises,
  onSubmit,
  initial = null,
  onCancel,
}) {
  const [name, setName] = useState(initial?.name || "");
  const [items, setItems] = useState(initial?.items || []);
  const [selectedId, setSelectedId] = useState(exercises[0]?.id || "");

  const addExercise = () => {
    if (!selectedId) return;
    const ex = exercises.find((e) => e.id === selectedId);
    if (!ex) return;
    setItems((prev) => [...prev, { exerciseId: ex.id }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index, dir) => {
    setItems((prev) => {
      const arr = [...prev];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !items.length) return;
    onSubmit({ name, items });
  };

  const selectedName = exercises.find((ex) => ex.id === selectedId)?.name || "";

  return (
    <FormModal
      title={initial ? "Редактировать тренировку" : "Новая тренировка"}
      onClose={onCancel}
    >
      <form className="form form-in-modal" onSubmit={handleSubmit}>
        <label>
          Название *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Утренняя"
            required
            autoFocus
          />
        </label>

        <div className="workout-add">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            title={selectedName}
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.rounds}×{ex.exercise}с)
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn"
            onClick={addExercise}
            disabled={!exercises.length}
          >
            + Добавить
          </button>
        </div>

        {items.length > 0 && (
          <ol className="workout-items">
            {items.map((item, i) => {
              const ex = exercises.find((e) => e.id === item.exerciseId);
              return (
                <li key={i}>
                  <span className="truncate" title={ex ? ex.name : "Удалено"}>
                    {ex ? ex.name : "Удалено"}
                  </span>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => move(i, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => move(i, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn small danger"
                      onClick={() => removeItem(i)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Отмена
          </button>
          <button
            type="submit"
            className="btn primary"
            disabled={!items.length}
          >
            {initial ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
