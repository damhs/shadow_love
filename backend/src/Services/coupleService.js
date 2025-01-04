const pool = require('../mysql.js');

const createCouple = async (userID1, userID2) => {
  try {
    await pool.query('INSERT INTO Couple (coupleID, userID1, userID2) VALUES (UUID_TO_BIN(UUID(), 1), ?, ?)', [userID1, userID2]);
  } catch (error) {
    console.error('Error creating couple: ', error);
  }
}

module.exports = {
    createCouple
}