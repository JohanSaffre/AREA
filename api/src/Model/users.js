const { Pool } = require('pg');

// Connect db
const pool = new Pool();

const getUserByEmail = async (email) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return user.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const createUser = async (user) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [user.username, user.email, user.password]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const getUsernameById = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const getNumberUser = async () => {
  try {
    const result = await pool.query(
      "SELECT count(*) AS nb FROM users"
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getUserByEmail,
  createUser,
  getUsernameById,
  getNumberUser
}
