const pool = require('../mysql.js');

const getUserID = async (id) => {
  try {
    const [result] = await pool.query('SELECT userID FROM User WHERE id = ?', [id]);
    return result[0].userID;
  } catch (error) {
    console.error('Error getting userID: ', error);
  }
}

const getPassword = async (id) => {
  try {
    const [result] = await pool.query('SELECT password FROM User WHERE id = ?', [id]);
    return result[0].password;
  }  catch (error) {
    console.error('Error getting password: ', error);
  }
};

const createUser = async (name, id, password) => {
  try {
    await pool.query('INSERT INTO User (userID, name, id, password) VALUES (UUID_TO_BIN(UUID(), 1), ?, ?, ?)', [name, id, password]);
  } catch (error) {
    console.error('Error creating user: ', error);
  }
};

const createKakaoUser = async (name, email) => {
  try {
    await pool.query('INSERT INTO User (userID, name, email) VALUES (UUID_TO_BIN(UUID(), 1), ?, ?)', [name, email]);
  } catch (error) {
    console.error('Error creating user: ', error);
  }
}


module.exports = {
  getUserID,
  getPassword,
  createUser,
  createKakaoUser,
};