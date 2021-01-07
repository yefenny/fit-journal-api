const BodyPartsService = {
  getAllBodyParts(knex) {
    return knex('body_part').select('*');
  }
};

module.exports = BodyPartsService;
