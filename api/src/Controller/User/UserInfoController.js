const User = require('./../../Model/users')

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendUsername(res, username) {
  res.json({
    username: username
  });
}

//#endregion


//#region Controller

const getUsername = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const result = await User.getUsernameById(user_id);
    sendUsername(res, result.username);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion


module.exports = {
  getUsername
}
