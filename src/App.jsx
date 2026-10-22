import { useEffect, useState } from "react";
import ExerciseForm from "./components/ExerciseForm";
import ExerciseList from "./components/ExerciseList";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import Timer from "./components/Timer";
import {
  buildStepsForExercise,
  buildStepsForWorkout,
} from "./utils/buildSteps";
import {
  loadExercises,
  saveExercises,
  loadWorkouts,
  saveWorkouts,
  loadSound,
  saveSound,
} from "./utils/storage";
import "./App.css";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export default function App() {
  const [tab, setTab] = useState("timer");
  const [exercises, setExercises] = useState(() => loadExercises());
  const [workouts, setWorkouts] = useState(() => loadWorkouts());
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [pendingSteps, setPendingSteps] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(loadSound);

  useEffect(() => saveExercises(exercises), [exercises]);
  useEffect(() => saveWorkouts(workouts), [workouts]);
  useEffect(() => saveSound(soundEnabled), [soundEnabled]);

  // Запрос постоянного хранилища (защита от автоматической очистки)
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        console.log(
          persistent
            ? "Хранилище защищено от автоматической очистки."
            : "Постоянное хранилище не предоставлено. Данные могут быть очищены при нехватке места.",
        );
      });
    }
  }, []);

  const addExercise = (data) => {
    setExercises((prev) => [{ ...data, id: uid() }, ...prev]);
    setEditingExercise(null);
  };

  const updateExercise = (data) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === editingExercise.id ? { ...data, id: e.id } : e,
      ),
    );
    setEditingExercise(null);
  };

  const deleteExercise = (id) => {
    if (!window.confirm("Удалить упражнение?")) return;
    setExercises((prev) => prev.filter((e) => e.id !== id));
    setWorkouts((prev) =>
      prev
        .map((w) => ({
          ...w,
          items: w.items.filter((it) => it.exerciseId !== id),
        }))
        .filter((w) => w.items.length > 0),
    );
  };

  const addWorkout = (data) => {
    setWorkouts((prev) => [{ ...data, id: uid() }, ...prev]);
    setEditingWorkout(null);
  };

  const updateWorkout = (data) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === editingWorkout.id ? { ...data, id: w.id } : w)),
    );
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    if (!window.confirm("Удалить тренировку?")) return;
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const startExercise = (ex) => {
    setPendingSteps(buildStepsForExercise(ex));
    setTab("timer");
  };

  const startWorkout = (w) => {
    setPendingSteps(buildStepsForWorkout(w, exercises));
    setTab("timer");
  };

  // Экспорт всех данных в JSON-файл
  const exportData = () => {
    const data = {
      exercises,
      workouts,
      soundEnabled,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabata-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Импорт данных из файла
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = ""; // сброс сразу, чтобы можно было выбрать тот же файл повторно

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.exercises || !data.workouts) {
          alert("Неверный формат файла");
          return;
        }
        if (window.confirm("Импорт заменит все текущие данные. Продолжить?")) {
          setExercises(data.exercises);
          setWorkouts(data.workouts);
          if (typeof data.soundEnabled === "boolean") {
            setSoundEnabled(data.soundEnabled);
          }
          alert("Данные успешно импортированы");
        }
      } catch {
        alert("Не удалось прочитать файл");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏋️ Tabata Timer</h1>

        <div className="backup-actions">
          <button className="backup-btn export" onClick={exportData}>
            <span className="icon">📥</span>
            Экспорт
          </button>
          <label className="backup-btn import">
            <span className="icon">📤</span>
            Импорт
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="sound-toggle">
          <button
            className={`btn small ${soundEnabled ? "primary" : ""}`}
            onClick={() => setSoundEnabled((v) => !v)}
            title={soundEnabled ? "Выключить звук" : "Включить звук"}
          >
            {soundEnabled ? "🔊 Звук вкл" : "🔇 Звук выкл"}
          </button>
        </div>

        <nav className="tabs">
          <button
            className={tab === "timer" ? "active" : ""}
            onClick={() => setTab("timer")}
          >
            Таймер
          </button>
          <button
            className={tab === "exercises" ? "active" : ""}
            onClick={() => setTab("exercises")}
          >
            Упражнения
          </button>
          <button
            className={tab === "workouts" ? "active" : ""}
            onClick={() => setTab("workouts")}
          >
            Тренировки
          </button>
        </nav>
      </header>

      <main>
        {tab === "timer" && (
          <Timer
            startSteps={pendingSteps}
            clearStartSteps={() => setPendingSteps(null)}
            soundEnabled={soundEnabled}
          />
        )}

        {tab === "exercises" && (
          <div className="panel">
            <ExerciseForm
              key={editingExercise?.id || "new"}
              initial={editingExercise}
              onSubmit={editingExercise ? updateExercise : addExercise}
              onCancel={editingExercise ? () => setEditingExercise(null) : null}
            />
            <ExerciseList
              exercises={exercises}
              onEdit={setEditingExercise}
              onDelete={deleteExercise}
              onStart={startExercise}
            />
          </div>
        )}

        {tab === "workouts" && (
          <div className="panel">
            {exercises.length === 0 ? (
              <p className="muted">
                Сначала создайте хотя бы одно упражнение во вкладке
                «Упражнения».
              </p>
            ) : (
              <WorkoutForm
                key={editingWorkout?.id || "new"}
                exercises={exercises}
                initial={editingWorkout}
                onSubmit={editingWorkout ? updateWorkout : addWorkout}
                onCancel={editingWorkout ? () => setEditingWorkout(null) : null}
              />
            )}
            <WorkoutList
              workouts={workouts}
              exercises={exercises}
              onEdit={setEditingWorkout}
              onDelete={deleteWorkout}
              onStart={startWorkout}
            />
          </div>
        )}
      </main>
    </div>
  );
}
