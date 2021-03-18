const secret = require('../../../config/secret.json');
const axios = require('axios');
const { getUserGoogleToken } = require('./GoogleAuthController');
const querystring = require('querystring');

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendUserNotFound(res) {
  res.status(404).send("User not found on Google users");
}

function sendEvents(res, events) {
  events.reverse();
  res.json({
    events: events
  });
}

//#endregion

//#region Tools

function getGoogleEventUrl(apiKey) {
  const now = new Date();
  const date = querystring.escape(now.toISOString());
  return 'https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=updated&timeMin=' + date + '&key=' + apiKey;
}

async function getUserEvents(accessToken, apiKey) {
  try {
    const result = await axios.get(getGoogleEventUrl(apiKey), {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    return result.data.items;
  } catch (err) {
    throw err;
  }
}

//#endregion

//#region Controller

const getGoogleEvents = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const google_token = await getUserGoogleToken(user_id);
    if (google_token) {
      const events = await getUserEvents(google_token.access_token, secret.Google.Service.apiKey);
      sendEvents(res, events);
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
  getGoogleEvents
}
