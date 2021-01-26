const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user-1@email.com',
      full_name: 'test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      email: 'test-user-2@email.com',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 3,
      email: 'test-user-3@email.com',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 4,
      email: 'test-user-4@email.com',
      full_name: 'Test user 4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}
function makeExerciseArray() {
  return [
    {
      id: 1,
      title: 'squat',
      url: 'https://www.youtube.com/watch?v=U3HlEF_E9fo',
      description: 'exercise to better legs',
      user_id: 1
    },
    {
      id: 2,
      title: 'lunge',
      url: 'https://www.youtube.com/watch?v=U3HlEF_E9fo',
      description: 'exercise for legs',
      user_id: 1
    }
  ];
}
function makeExerciseMuscleArray() {
  return [
    { id: 1, exercise_id: 1, muscle_id: 10 },
    { id: 2, exercise_id: 2, muscle_id: 10 }
  ];
}
function insertBodyPartsAndMuscles(db) {
  return db.raw(` INSERT INTO body_part(name,category) 
  values('chest','upper body'),
  ('back','upper body'),
  ('arms','upper body'),
  ('abdominals','upper body'),
  ('legs','lower body'),
  ('shoulders','upper body');
 
  INSERT into muscle_group (name, body_part_id)
  values ('calves',5),
  ('hamstrings',5),
  ('quadriceps',5),
  ('glutes',5),
  ('biceps',3),
  ('triceps',3),
  ('forearms',3),
  ('trapezius',6),
  ('Latissimus dorsi',2),
  ('upper chest', 1),
  ('middle chest',1),
  ('lower chest', 1),
  ('abdominals',4);`);
}

function insertMeals(db) {
  return db.raw(`INSERT INTO meals (title, url, description, user_id)
  values ('pumpkin protein cookies','https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/', 'High protein pumpin cookies',1),
   ('Banana protein bread','https://www.burnthefatblog.com/protein-banana-bread/', 'High protein banana bread',1),
   ('Chipotle tomato salsa','https://www.culinaryhill.com/fresh-tomato-salsa-chipotle-copycat/#wprm-recipe-container-29457','Copycat of chipotle tomato salsa',2),
   ('Pollo and Pinto mini tacos','https://mealprepmanual.com/pollo-and-pinto-mini-tacos/','Mini tacos with chicken and pinto beans',1);
  `);
}
function cleanTables(db) {
  return db.transaction((mdb) =>
    mdb
      .raw(
        'TRUNCATE users, users_body_composition, meals, exercises , body_part, muscle_group, exercises_muscle_group, workouts, workouts_exercises '
      )
      .then(() =>
        Promise.all([
          mdb.raw(
            `TRUNCATE users, users_body_composition, meals, exercises , body_part, muscle_group, exercises_muscle_group, workouts, workouts_exercises RESTART IDENTITY CASCADE`
          )
        ])
      )
  );
}
function seedUserTable(db, users) {
  const hashedUser = users.map((user) => {
    return {
      ...user,
      password: bcrypt.hashSync(user.password, 7)
    };
  });
  return db('users')
    .insert(hashedUser)
    .then(() => {
      return db.raw(
        `SELECT setval('users_id_seq',?)`,
        users[users.length - 1].id
      );
    });
}

function jwtToken(user) {
  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
    subject: user.email,
    algorithm: 'HS256'
  });

  return token;
}

module.exports = {
  makeUsersArray,
  cleanTables,
  seedUserTable,
  jwtToken,
  makeExerciseArray,
  insertBodyPartsAndMuscles,
  insertMeals
};
