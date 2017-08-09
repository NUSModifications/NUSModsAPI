exports.up = (knex, Promise) => {
  const schoolsTable = knex.schema.createTable('schools', (table) => {
    table.uuid('id').primary();
    table.string('name').unique();
    table.string('abbreviation', 32);
  });

  const departmentsTable = knex.schema.createTable('departments', (table) => {
    table.index(['school_id', 'name'], 'id').primary();
    table
      .uuid('school_id')
      .notNullable()
      .references('id')
      .inTable('schools')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('name').notNullable();
  });

  const venuesTable = knex.schema.createTable('venues', (table) => {
    table.uuid('id').primary();
    table
      .uuid('department_id')
      .references('id')
      .inTable('departments')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table.string('name').notNullable();
    table.string('type');
  });

  return Promise.all([schoolsTable, departmentsTable, venuesTable]);
};

exports.down = (knex, Promise) => {
  const tables = ['Users'];
  return Promise.all(
    tables.map(table =>
      knex.schema.dropTableIfExists(table).then(() => {
        console.log(`${table} was dropped`);
      }),
    ),
  );
};
