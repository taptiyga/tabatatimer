export function buildStepsForExercise(
  ex,
  exerciseIndex = 1,
  exerciseTotal = 1,
) {
  const rounds = Math.max(1, ex.rounds || 1);
  const exerciseDuration = Math.max(1, ex.exercise || 1);
  const prepareDuration = Math.max(0, ex.prepare || 0);
  const restDuration = Math.max(0, ex.rest || 0);

  const steps = [];
  for (let r = 1; r <= rounds; r++) {
    if (prepareDuration > 0 && r === 1) {
      steps.push({
        type: "prepare",
        duration: prepareDuration,
        exerciseName: ex.name,
        round: r,
        totalRounds: rounds,
        exerciseIndex,
        exerciseTotal,
      });
    }
    steps.push({
      type: "exercise",
      duration: exerciseDuration,
      exerciseName: ex.name,
      round: r,
      totalRounds: rounds,
      exerciseIndex,
      exerciseTotal,
    });
    if (restDuration > 0 && r < rounds) {
      steps.push({
        type: "rest",
        duration: restDuration,
        exerciseName: ex.name,
        round: r,
        totalRounds: rounds,
        exerciseIndex,
        exerciseTotal,
      });
    }
  }
  return steps;
}

export function buildStepsForWorkout(workout, exercises) {
  const valid = workout.items
    .map((item) => exercises.find((e) => e.id === item.exerciseId))
    .filter(Boolean);

  const steps = [];
  valid.forEach((ex, i) => {
    steps.push(...buildStepsForExercise(ex, i + 1, valid.length));
  });
  return steps;
}
