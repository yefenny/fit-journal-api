CREATE TABLE workouts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name text NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE  CASCADE NOT NULL,
    date_created timestamp DEFAULT NOW() NOT NULL
)