const UserServices = require('../../Model/user-services')

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendUserServices(res, data) {
  res.json({
    services: [
      {
        name: "spotify",
        active: data.spotify
      },
      {
        name: "google",
        active: data.google
      }
    ]
  });
}

//#endregion

//#region Controller

const getUserServices = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const result = await UserServices.getUserServices(user_id);
    sendUserServices(res, result);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

module.exports = {
  getUserServices
};
