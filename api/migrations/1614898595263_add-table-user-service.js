/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('user_services', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    spotify: { type: 'bool', notNull: true,  default: false },
    twitter: { type: 'bool', notNull: true,  default: false },
    google: { type: 'bool', notNull: true,  default: false },
    create_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  pgm.createIndex('user_services', 'user_id');
};

exports.down = pgm => {
  pgm
};
