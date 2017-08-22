exports.up = (knex, Promise) => {
  const schoolsTable = knex.schema.createTable('schools', (table) => {
    table.increments('id');
    table.string('name').notNullable().unique();
    table.string('abbreviation', 32);
  });

  const departmentsTable = knex.schema.createTable('departments', (table) => {
    table.uuid('id').notNullable().primary();
    table
      .integer('school_id')
      .notNullable()
      .references('id')
      .inTable('schools')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('name').notNullable();
    table.unique(['school_id', 'name']);
  });

  const venuesTable = knex.schema.createTable('venues', (table) => {
    table
      .integer('school_id')
      .notNullable()
      .references('id')
      .inTable('schools')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('name').notNullable();
    table.string('type');
    table.string('owned_by');
    table.primary(['school_id', 'name']);
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
