const UserWidgets = require('../../Model/user-widgets');

//#region Response

function sendUserWidgets(res, data) {
  res.json({
    widgets: [
      {
        name: "spotify_player",
        pretty_name: "Player",
        active: data.spotify_player
      },
      {
        name: "spotify_playlist",
        pretty_name: "Playlists Favorites",
        active: data.spotify_playlist
      },
      {
        name: "spotify_favorite",
        pretty_name: "Musiques Favorites",
        active: data.spotify_favorite
      },
      {
        name: "google_recent_photos",
        pretty_name: "Photos Récentes",
        active: data.google_recent_photos
      },
      {
        name: "google_random_photo",
        pretty_name: "Photo aléatoire",
        active: data.google_random_photo
      },
      {
        name: "google_calendar",
        pretty_name: "Calendrier",
        active: data.google_calendar
      },
    ]
  })
}

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendSuccess(res) {
  res.json({
    message: "Success"
  });
}

//#endregion

//#region Controller

const getUserWidgets = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const result = await UserWidgets.getUserWidgets(user_id);
    sendUserWidgets(res, result);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const setUserWidgets = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    for (const widget of req.body.widgets) {
      await UserWidgets.updateUserWidgets(widget.active, widget.name, user_id);
    }
    sendSuccess(res);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

module.exports = {
  getUserWidgets,
  setUserWidgets
}
