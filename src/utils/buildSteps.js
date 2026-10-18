// Утилиты построения шагов таймера.
// Вынесено из Timer.jsx, чтобы Fast Refresh работал корректно.

export function buildStepsForExercise(ex) {
  const steps = [];
  for (let r = 1; r <= ex.rounds; r++) {
    if (ex.prepare > 0 && r === 1) {
      steps.push({
        type: "prepare",
        duration: ex.prepare,
        exerciseName: ex.name,
        round: r,
        totalRounds: ex.rounds,
      });
    }
    steps.push({
      type: "exercise",
      duration: ex.exercise,
      exerciseName: ex.name,
      round: r,
      totalRounds: ex.rounds,
    });
    if (ex.rest > 0 && r < ex.rounds) {
      steps.push({
        type: "rest",
        duration: ex.rest,
        exerciseName: ex.name,
        round: r,
        totalRounds: ex.rounds,
      });
    }
  }
  return steps;
}

export function buildStepsForWorkout(workout, exercises) {
  const steps = [];
  workout.items.forEach((item) => {
    const ex = exercises.find((e) => e.id === item.exerciseId);
    if (ex) steps.push(...buildStepsForExercise(ex));
  });
  return steps;
}
