const knex = require('knex');
function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 4,
      user_name: 'test-user-4',
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

module.exports = {
  makeUsersArray,
  cleanTables
};