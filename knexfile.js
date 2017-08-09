// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './dev.sqlite3',
    },
    debug: true,
  },

  staging: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './stage.sqlite3',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './prod.sqlite3',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
