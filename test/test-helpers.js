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
function cleanTables(db) {
  return db.transaction((mdb) =>
    mdb
      .raw(
        'TRUNCATE users, users_body_composition, meals, exercises , body_part, muscle_group, exercises_muscle_group, workouts, workouts_exercises '
      )
      .then(() =>
        Promise.all([
          mdb.raw(`Alter sequence body_part_id_seq minvalue 0 START WITH 1`),
          mdb.raw(`Alter sequence exercises_id_seq minvalue 0 START WITH 1`),
          mdb.raw(
            `Alter sequence exercises_muscle_group_id_seq minvalue 0 START WITH 1`
          ),
          mdb.raw(`Alter sequence meals_id_seq minvalue 0 START WITH 1`),
          mdb.raw(`ALter sequence muscle_group_id_seq minvalue 0 START WITH 1`),
          mdb.raw(
            `Alter sequence users_body_composition_id_seq minvalue 0 START with 1`
          ),
          mdb.raw(`Alter sequence users_id_seq minvalue 0 START WITH 1`),
          mdb.raw(
            `Alter sequence workouts_exercises_id_seq minvalue 0 START WITH 1`
          ),
          mdb.raw(`Alter sequence workouts_id_seq minvalue 0 START WITH 1`),

          mdb.raw(`SELECT setval('body_part_id_seq',0)`),
          mdb.raw(`SELECT setval('exercises_id_seq',0)`),
          mdb.raw(`SELECT setval('exercises_muscle_group_id_seq',0)`),
          mdb.raw(`SELECT setval('meals_id_seq',0)`),
          mdb.raw(`SELECT setval('muscle_group_id_seq',0)`),
          mdb.raw(`SELECT setval('users_body_composition_id_seq',0)`),
          mdb.raw(`SELECT setval('users_id_seq',0)`),
          mdb.raw(`SELECT setval('workouts_exercises_id_seq',0)`),
          mdb.raw(`SELECT setval('workouts_id_seq',0)`)
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
  jwtToken
};
