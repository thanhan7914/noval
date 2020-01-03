
exports.up = function(knex) {
    return knex.schema.createTable('phones', function(table) {
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
        table.string('phone').notNullable();
        table.primary(['user_id']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('phones');
};
