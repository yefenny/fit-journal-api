CREATE TABLE exercises_muscle_group (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
    muscle_group_id INTEGER REFERENCES muscle_group(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(exercise_id,muscle_group_id)
)