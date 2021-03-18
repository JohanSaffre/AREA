const { getUserSpotifyClient } = require('./SpotifyAuthController');

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendUserNotFound(res) {
  res.status(404).send("User not found on Spotify users");
}

function sendSuccess(res) {
  res.json({
    message: "Success"
  });
}

function sendCurrent(res, data) {
  res.json({
    current: data.body.item
  });
}

function sendIsPlaying(res, data) {
  res.json({
    is_playing: data.body.is_playing
  });
}

//#endregion

//#region Controller

const pause = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      await spotifyApi.pause()
      sendSuccess(res);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const play = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      await spotifyApi.play()
      sendSuccess(res);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const next = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      await spotifyApi.skipToNext();
      sendSuccess(res);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const prev = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    await spotifyApi.skipToPrevious();
    sendSuccess(res);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const current = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      data = await spotifyApi.getMyCurrentPlayingTrack()
      sendCurrent(res, data);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const isPlaying = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      data = await spotifyApi.getMyCurrentPlaybackState()
      sendIsPlaying(res, data);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

//#region Exports

module.exports = {
  pause,
  play,
  next,
  prev,
  current,
  isPlaying,
}

//#endregion
