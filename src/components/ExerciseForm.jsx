import { useState } from "react";
import TimeField from "./TimeField";
import RoundsField from "./RoundsField";
import FormModal from "./FormModal";

const empty = {
  name: "",
  description: "",
  prepare: 10,
  exercise: 20,
  rest: 10,
  rounds: 8,
};

export default function ExerciseForm({ onSubmit, initial = null, onCancel }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...empty });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setTime = (field) => (seconds) => {
    setForm((prev) => ({ ...prev, [field]: seconds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <FormModal
      title={initial ? "Редактировать упражнение" : "Новое упражнение"}
      onClose={onCancel}
    >
      <form className="form form-in-modal" onSubmit={handleSubmit}>
        <label>
          Название *
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Например: Берпи"
            required
            autoFocus
          />
        </label>

        <label>
          Описание (необязательно)
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Техника выполнения..."
            rows={2}
          />
        </label>

        <div className="time-grid">
          <TimeField
            label="Подготовка"
            value={form.prepare}
            onChange={setTime("prepare")}
          />
          <TimeField
            label="Упражнение"
            value={form.exercise}
            onChange={setTime("exercise")}
            min={1}
          />
          <TimeField
            label="Отдых"
            value={form.rest}
            onChange={setTime("rest")}
          />
          <RoundsField value={form.rounds} onChange={setTime("rounds")} />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="btn primary">
            {initial ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
