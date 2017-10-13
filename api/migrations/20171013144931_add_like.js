
exports.up = function(knex, Promise) {
  return knex.schema.createTable('like', t => {
    t.increments()
    t.integer('user_id').unsigned()
    t.foreign('user_id').references('user.id')
    t.string('target_id')
    t.foreign('target_id').references('post.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('like')
};
