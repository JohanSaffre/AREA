/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    username: { type: 'varchar(40)', notNull: true },
    email: { type: 'varchar(1000)', notNull: true },
    password: { type: 'varchar(1000)', notNull: true },
    createAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  pgm.createTable('user_tokens', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    service: { type: 'varchar(50)', notNull: true },
    access_token: { type: 'varchar(1000)', notNull: true },
    refresh_token: { type: 'varchar(1000)', notNull: true },
    create_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  pgm.createIndex('user_tokens', 'user_id');
};

exports.down = pgm => {};
