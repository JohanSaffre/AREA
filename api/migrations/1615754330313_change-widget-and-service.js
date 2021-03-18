/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumns( 'user_services', ['twitter'], { ifExists: true });
  pgm.dropColumns( 'user_widgets', ['twitter_tweet', 'twitter_trend', 'twitter_timeline'], { ifExists: true });
  pgm.renameColumn( 'user_widgets', 'google_news', 'google_recent_photos');
  pgm.renameColumn( 'user_widgets', 'google_email', 'google_random_photo');
  pgm.renameColumn( 'user_widgets', 'google_photo', 'google_calendar');
};

exports.down = pgm => {};
