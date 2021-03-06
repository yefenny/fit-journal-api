CREATE TABLE exercises (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    date_created timestamp DEFAULT now(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
)