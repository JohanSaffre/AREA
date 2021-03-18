const { Pool } = require('pg');

// Connect db
const pool = new Pool();

const createUserServices = async (user_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO user_services (user_id) VALUES ($1) RETURNING id",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const updateUserServices = async (active, service, user_id) => {
  try {
    await pool.query(
      "UPDATE  user_services SET " + service.toLowerCase() + " = $1 WHERE user_id = $2",
      [active, user_id]
    );
  } catch (err) {
    throw err;
  }
}

const getUserServices = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_services WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const getNumberUserService = async (service) => {
  try {
    const result = await pool.query(
      "SELECT count(*) AS nb FROM user_services WHERE " + service.toLowerCase() + " = true"
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUserServices,
  updateUserServices,
  getUserServices,
  getNumberUserService
}
