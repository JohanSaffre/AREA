const secret = require('../../../config/secret.json');
const axios = require('axios');
const { getUserGoogleToken } = require('./GoogleAuthController');
const random = require('random');

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendPhotosData(res, photos) {
  res.json({
    photos
  });
}

function sendUserNotFound(res) {
  res.status(404).send("User not found on Google users");
}

//#endregion


//#region Tools

function getGooglePhotoUrl(nbPhoto, apiKey) {
  return 'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=' + nbPhoto + '&key=' + apiKey;
}

async function getGooglePhotos(nbPhoto, accessToken, apiKey) {
  try {
    const result = await axios.get(getGooglePhotoUrl(nbPhoto, apiKey), {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    return result.data.mediaItems;
  } catch (err) {
    throw err;
  }
}

//#endregion

//#region Controller

const getRecentPhotos = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const google_token = await getUserGoogleToken(user_id);
    if (google_token) {
      const nbPhoto = 10;
      const photos = await getGooglePhotos(nbPhoto, google_token.access_token, secret.Google.Service.apiKey);
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const type = photo.mimeType.split('/');
        if (type[0] === 'video') {
          photos.splice(i, 1);
        }
      }
      sendPhotosData(res, photos);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const getRandomPhotos = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const google_token = await getUserGoogleToken(user_id);
    if (google_token) {
      const nbPhoto = 100;
      let randomPhoto = random.int(0,nbPhoto);
      const photos = await getGooglePhotos(nbPhoto, google_token.access_token, secret.Google.Service.apiKey)
      var type = photos[randomPhoto].mimeType.split('/');
      while (type[0] === 'video') {
        randomPhoto = random.int(0,nbPhoto);
        type = photos[randomPhoto].mimeType.split('/');
      }
      sendPhotosData(res, photos[randomPhoto]);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

module.exports = {
  getRecentPhotos,
  getRandomPhotos
}
