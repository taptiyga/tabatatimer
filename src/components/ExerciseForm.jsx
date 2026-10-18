import { useState } from "react";
import TimeInput from "./TimeInput";

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
    const numeric = ["rounds"].includes(name);
    setForm((prev) => ({
      ...prev,
      [name]: numeric ? Number(value) : value,
    }));
  };

  const setTime = (field) => (seconds) => {
    setForm((prev) => ({ ...prev, [field]: seconds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    if (!initial) setForm({ ...empty });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{initial ? "Редактировать упражнение" : "Новое упражнение"}</h3>

      <label>
        Название *
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Например: Берпи"
          required
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
        <TimeInput
          label="Подготовка"
          value={form.prepare}
          onChange={setTime("prepare")}
        />
        <TimeInput
          label="Упражнение"
          value={form.exercise}
          onChange={setTime("exercise")}
        />
        <TimeInput label="Отдых" value={form.rest} onChange={setTime("rest")} />
        <label className="rounds-label">
          Повторений
          <input
            type="number"
            min="1"
            name="rounds"
            value={form.rounds}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="btn primary">
          {initial ? "Сохранить" : "Добавить"}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
