// settingService.js
const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getIsShowed = async (ID) => {
  try {
    const [isShowed] = await pool.query(
      "SELECT isShowed FROM Couple WHERE ID1 = ? OR ID2 = ?",
      [ID, ID]
    );
    return isShowed;
  } catch (error) {
    console.error("Error getting isShowed: ", error);
  }
}

const updateIsShowed = async (ID, isShowed) => {
  try {
    await pool.query(
      "UPDATE Couple SET isShowed = ? WHERE ID1 = ? OR ID2 = ?",
      [isShowed, ID, ID]
    );
    return isShowed;
  } catch (error) {
    console.error("Error updating isShowed: ", error);
  }
}

const deleteUser = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM User WHERE ID = ?",
      [ID]
    );
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}

const deletePartnerUser = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM User WHERE coupleID = ?",
      [ID]
    );
  } catch (error) {
    console.error("Error deleting partner user: ", error);
  }
}

const deleteCouple = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM Couple WHERE ID1 = ? OR ID2 = ?",
      [ID, ID]
    );
  } catch (error) {
    console.error("Error deleting couple: ", error);
  }
}

const deleteDiary = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM Diary WHERE ID = ?",
      [ID]
    );
  } catch (error) {
    console.error("Error deleting diary: ", error);
  }
}

const deleteEmotion = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM Emotion WHERE ID = ?",
      [ID]
    );
  } catch (error) {
    console.error("Error deleting emotion: ", error);
  }
}

const deleteArtwork = async (ID) => {
  try {
    await pool.query(
      "DELETE FROM Artwork WHERE ID1 = ? OR ID2 = ?",
      [ID, ID]
    );
  } catch (error) {
    console.error("Error deleting artwork: ", error);
  }
}

module.exports = {
  getIsShowed,
  updateIsShowed,
  deleteUser,
  deletePartnerUser,
  deleteCouple,
  deleteDiary,
  deleteEmotion,
  deleteArtwork,
}; 