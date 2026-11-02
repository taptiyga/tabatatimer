const EXERCISES_KEY = "tabata_exercises";
const WORKOUTS_KEY = "tabata_workouts";
const SOUND_KEY = "tabata_sound_enabled";

// Безопасное чтение массива из localStorage
const loadArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Безопасная запись массива (защита от QuotaExceededError)
const saveArray = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Не удалось сохранить "${key}":`, err);
  }
};

export const loadExercises = () => loadArray(EXERCISES_KEY);
export const saveExercises = (exercises) => saveArray(EXERCISES_KEY, exercises);

export const loadWorkouts = () => loadArray(WORKOUTS_KEY);
export const saveWorkouts = (workouts) => saveArray(WORKOUTS_KEY, workouts);

export const loadSound = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== "false";
  } catch {
    return true;
  }
};

export const saveSound = (enabled) => {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch (err) {
    console.warn("Не удалось сохранить настройку звука:", err);
  }
};
