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
  // Одиночное упражнение — 1/1
  return steps.map((s) => ({ ...s, exerciseIndex: 1, exerciseTotal: 1 }));
}

export function buildStepsForWorkout(workout, exercises) {
  const valid = workout.items
    .map((item) => exercises.find((e) => e.id === item.exerciseId))
    .filter(Boolean);

  const steps = [];
  valid.forEach((ex, i) => {
    const exerciseSteps = buildStepsForExercise(ex);
    exerciseSteps.forEach((s) => {
      steps.push({
        ...s,
        exerciseIndex: i + 1,
        exerciseTotal: valid.length,
      });
    });
  });
  return steps;
}
