const pool = require('../mysql.js');
const uuid = require('uuid-sequential');

const createUser = async(ID) => {
  try {
    await pool.query('INSERT INTO User (ID) VALUES (?)', [ID]);
    console.log("User Inserted:", ID);
    return ID;
  } catch (error) {
    console.error('Error creating user: ', error);
  }
}

const getUser = async(ID) => {
  try {
    const [user] = await pool.query('SELECT * FROM User WHERE ID = ?', [ID]);
    return user;
  } catch (error) {
    console.error('Error getting user: ', error);
  }
}

const updatePlayerID = async(ID, playerID) => {
  try {
    await pool.query('UPDATE User SET playerID = ? WHERE ID = ?', [playerID, ID]);
    console.log('updatePlayerID: ', playerID);
    return playerID;
  } catch (error) {
    console.error('Error updating playerID: ', error);
  }
}

const getAllUserID = async() => {
  try {
    const [ID] = await pool.query('SELECT ID FROM User');
    return ID;
  } catch (error) {
    console.error('Error getting user: ', error);
  }
}

const getCouple = async(ID) => {
  try {
    const [coupleID] = await pool.query('SELECT coupleID FROM User WHERE ID = ?', [ID]);
    return coupleID;
  } catch (error) {
    console.error('Error getting couple: ', error);
  }
}

const deleteUser = async(ID) => {
  try {
    await pool.query('DELETE FROM User WHERE ID = ?', [ID]);
    return ID;
  } catch (error) {
    console.error('Error deleting user: ', error);
  }
}

const updateCouple = async(ID, coupleID) => {
  try {
    await pool.query('UPDATE User SET coupleID = ? WHERE ID = ?', [coupleID, ID]);
    return coupleID;
  } catch (error) {
    console.error('Error updating couple: ', error);
  }
}

const createCouple = async(ID1, ID2) => {
  try {
    const coupleID = uuid();
    await pool.query('INSERT INTO Couple (coupleID, ID1, ID2) VALUES (UUID_TO_BIN(?, 1), ?, ?)', [coupleID, ID1, ID2]);
    return coupleID;
  } catch (error) {
    console.error('Error creating couple: ', error);
  }
}

const deleteDuplicateCouple = async(ID1, ID2) => {
  try {
    const [couples] = await pool.query('SELECT * FROM Couple WHERE (ID1 = ? AND ID2 = ?) OR (ID1 = ? AND ID2 = ?)', [ID1, ID2, ID2, ID1]);
    if (couples.length === 2) {
      await pool.query('DELETE FROM Couple WHERE (ID1 = ? AND ID2 = ?) OR (ID1 = ? AND ID2 = ?)', [ID1, ID2, ID2, ID1]);
      console.log(`Duplicate couples with IDs (${ID1}, ${ID2}) and (${ID2}, ${ID1}) deleted`);
    } else {
      console.log('No duplicate couples found to delete');
    }
  } catch (error) {
    console.error('Error deleting duplicate couple: ', error);
  }
}

module.exports = {
  createUser,
  getUser,
  getAllUserID,
  updatePlayerID,
  getCouple,
  deleteUser,
  updateCouple,
  createCouple,
  deleteDuplicateCouple,
};