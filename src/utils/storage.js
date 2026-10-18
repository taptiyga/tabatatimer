const EXERCISES_KEY = "tabata_exercises";
const WORKOUTS_KEY = "tabata_workouts";
const SOUND_KEY = "tabata_sound_enabled";

export const loadExercises = () => {
  try {
    return JSON.parse(localStorage.getItem(EXERCISES_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveExercises = (exercises) => {
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
};

export const loadWorkouts = () => {
  try {
    return JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveWorkouts = (workouts) => {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

export const loadSound = () => localStorage.getItem(SOUND_KEY) !== "false";
export const saveSound = (enabled) =>
  localStorage.setItem(SOUND_KEY, String(enabled));
