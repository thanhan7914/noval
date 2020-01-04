
exports.up = function(knex) {
    return knex.schema.createTable('addresses', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
        table.string('address').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('addresses');
};
