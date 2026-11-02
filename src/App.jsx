import { useEffect, useState } from "react";
import ExerciseForm from "./components/ExerciseForm";
import ExerciseList from "./components/ExerciseList";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import Timer from "./components/Timer";
import SettingsModal from "./components/SettingsModal";
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
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

export default function App() {
  const [tab, setTab] = useState("exercises");
  const [exercises, setExercises] = useState(() => loadExercises());
  const [workouts, setWorkouts] = useState(() => loadWorkouts());
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [pendingSteps, setPendingSteps] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(loadSound);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => saveExercises(exercises), [exercises]);
  useEffect(() => saveWorkouts(workouts), [workouts]);
  useEffect(() => saveSound(soundEnabled), [soundEnabled]);

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist();
    }
  }, []);

  // ---------- Упражнения ----------
  const openCreateExercise = () => setEditingExercise("new");
  const openEditExercise = (ex) => setEditingExercise(ex);
  const closeExerciseModal = () => setEditingExercise(null);

  const submitExercise = (data) => {
    if (editingExercise === "new") {
      setExercises((prev) => [{ ...data, id: uid() }, ...prev]);
    } else if (editingExercise && editingExercise.id) {
      setExercises((prev) =>
        prev.map((e) =>
          e.id === editingExercise.id ? { ...data, id: e.id } : e,
        ),
      );
    }
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
  const openCreateWorkout = () => setEditingWorkout("new");
  const openEditWorkout = (w) => setEditingWorkout(w);
  const closeWorkoutModal = () => setEditingWorkout(null);

  const submitWorkout = (data) => {
    if (editingWorkout === "new") {
      setWorkouts((prev) => [{ ...data, id: uid() }, ...prev]);
    } else if (editingWorkout && editingWorkout.id) {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === editingWorkout.id ? { ...data, id: w.id } : w,
        ),
      );
    }
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    if (!window.confirm("Удалить тренировку?")) return;
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // ---------- Таймер ----------
  const startExercise = (ex) => {
    setPendingSteps(buildStepsForExercise(ex));
    setTimerActive(true);
  };

  const startWorkout = (w) => {
    setPendingSteps(buildStepsForWorkout(w, exercises));
    setTimerActive(true);
  };

  const closeTimer = () => {
    setPendingSteps(null);
    setTimerActive(false);
    setTab("exercises");
  };

  // ---------- Бэкап ----------
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
    // Safari может скачивать асинхронно — откладываем revoke
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importData = (data) => {
    if (Array.isArray(data.exercises)) setExercises(data.exercises);
    if (Array.isArray(data.workouts)) setWorkouts(data.workouts);
    if (typeof data.soundEnabled === "boolean") {
      setSoundEnabled(data.soundEnabled);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>🏋️ Tabata Timer</h1>
          <button
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            title="Настройки"
            aria-label="Настройки"
          >
            ⚙
          </button>
        </div>

        {!timerActive && (
          <nav className="tabs">
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
        )}
      </header>

      <main>
        {timerActive && (
          <Timer
            startSteps={pendingSteps}
            clearStartSteps={() => setPendingSteps(null)}
            soundEnabled={soundEnabled}
            onClose={closeTimer}
          />
        )}

        {!timerActive && tab === "exercises" && (
          <ExerciseList
            exercises={exercises}
            onCreate={openCreateExercise}
            onEdit={openEditExercise}
            onDelete={deleteExercise}
            onStart={startExercise}
          />
        )}

        {!timerActive && tab === "workouts" && (
          <WorkoutList
            workouts={workouts}
            exercises={exercises}
            onCreate={openCreateWorkout}
            onEdit={openEditWorkout}
            onDelete={deleteWorkout}
            onStart={startWorkout}
          />
        )}
      </main>

      {editingExercise !== null && (
        <ExerciseForm
          key={editingExercise === "new" ? "new" : editingExercise.id}
          initial={editingExercise === "new" ? null : editingExercise}
          onSubmit={submitExercise}
          onCancel={closeExerciseModal}
        />
      )}

      {editingWorkout !== null && (
        <WorkoutForm
          key={editingWorkout === "new" ? "new" : editingWorkout.id}
          exercises={exercises}
          initial={editingWorkout === "new" ? null : editingWorkout}
          onSubmit={submitWorkout}
          onCancel={closeWorkoutModal}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          onExport={exportData}
          onImport={importData}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
