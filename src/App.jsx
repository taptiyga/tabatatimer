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
} from "./utils/storage";
import "./App.css";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const SOUND_KEY = "tabata_sound_enabled";
const loadSound = () => localStorage.getItem(SOUND_KEY) !== "false";

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
  useEffect(() => {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  // ---------- Упражнения ----------
  const addExercise = (data) => {
    setExercises((prev) => [...prev, { ...data, id: uid() }]);
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

  // ---------- Тренировки ----------
  const addWorkout = (data) => {
    setWorkouts((prev) => [...prev, { ...data, id: uid() }]);
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

  // ---------- Старт таймера ----------
  const startExercise = (ex) => {
    setPendingSteps(buildStepsForExercise(ex));
    setTab("timer");
  };

  const startWorkout = (w) => {
    setPendingSteps(buildStepsForWorkout(w, exercises));
    setTab("timer");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏋️ Tabata Timer</h1>

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
