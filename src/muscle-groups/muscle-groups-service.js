const MuscleGroupsService = {
  getAllMusclesGroup(knex) {
    return knex('muscle_group').select('*');
  },
  getMusclesGroupByBodyPart(knex, bodyPartId) {
    return knex('muscle_group').where('body_part_id', bodyPartId);
  }
};

module.exports = MuscleGroupsService;
