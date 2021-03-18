/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('user_widgets', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    spotify_player: { type: 'bool', notNull: true,  default: false },
    spotify_favorite: { type: 'bool', notNull: true,  default: false },
    spotify_playlist: { type: 'bool', notNull: true,  default: false },
    twitter_tweet: { type: 'bool', notNull: true,  default: false },
    twitter_timeline: { type: 'bool', notNull: true,  default: false },
    twitter_trend: { type: 'bool', notNull: true,  default: false },
    google_email: { type: 'bool', notNull: true,  default: false },
    google_photo: { type: 'bool', notNull: true,  default: false },
    google_news: { type: 'bool', notNull: true,  default: false },
    create_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  pgm.createIndex('user_widgets', 'user_id');
};

exports.down = pgm => {};
