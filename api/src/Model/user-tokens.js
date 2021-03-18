const { Pool } = require('pg');

// Connect db
const pool = new Pool();


const createUserToken = async (userToken) => {
  try {
    const result = await pool.query(
      "INSERT INTO user_tokens (user_id, service, access_token, refresh_token, expires_at) VAlUES ($1, $2, $3, $4, $5) RETURNING id",
      [userToken.userId, userToken.service, userToken.access_token, userToken.refresh_token, userToken.expires_at]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const getUserTokenByUserIdAndService = async (user_id, service) => {
  try {
    const result = await pool.query(
      "SELECT access_token, refresh_token, expires_at FROM user_tokens WHERE user_id = $1 AND service = $2",
      [user_id, service]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const updateUserToken = async (access_token, expires_at, user_id, service) => {
  try {
    await pool.query(
      " UPDATE user_tokens SET access_token = $1, expires_at = $2 WHERE user_id = $3 AND service = $4",
      [access_token, expires_at, user_id, service]
    );
  } catch (err) {
    throw err;
  }
}

const deleteUserTokenByIdAndService = async (service, user_id) => {
  try {
    await pool.query(
      "DELETE FROM user_tokens WHERE user_id = $1 AND service = $2",
      [user_id, service]
    );
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUserToken,
  getUserTokenByUserIdAndService,
  updateUserToken,
  deleteUserTokenByIdAndService,
}
