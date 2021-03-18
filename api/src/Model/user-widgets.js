const { Pool } = require('pg');

// Connect db
const pool = new Pool();

const createUserWidgets = async (user_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO user_widgets (user_id) VALUES ($1) RETURNING id",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const updateUserWidgets = async (active, widget, user_id) => {
  try {
    await pool.query(
      "UPDATE  user_widgets SET " + widget.toLowerCase() + " = $1 WHERE user_id = $2",
      [active, user_id]
    );
  } catch (err) {
    throw err;
  }
}

const getUserWidgets = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_widgets WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

const getNumberUserWidget = async (widget) => {
  try {
    const result = await pool.query(
      "SELECT count(*) AS nb FROM user_widgets WHERE " + widget +" = true"
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUserWidgets,
  updateUserWidgets,
  getUserWidgets,
  getNumberUserWidget
}
