exports.up = function(knex) {
    return knex.schema.createTable('user_tag', function(table) {
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
        table.integer('tag_id').unsigned().notNullable()
            .references('id').inTable('tags').onDelete('CASCADE').onUpdate('RESTRICT');
        table.string('detail').notNullable();
        table.primary(['user_id', 'tag_id']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_tag');
};
