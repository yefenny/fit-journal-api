CREATE TABLE workouts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name text NOT NULL,
    date_created timestamp DEFAULT NOW() NOT NULL
)