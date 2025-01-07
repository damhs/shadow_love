const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getCoupleID = async (ID) => {
  try {
    const [coupleID] = await pool.query(
      "SELECT BIN_TO_UUID(coupleID) AS coupleID FROM Couple WHERE ID1 = ? OR ID2 = ?",
      [ID, ID]
    );
    return coupleID;
  } catch (error) {
    console.error("Error getting couple: ", error);
  }
}

const getArtworks = async (ID) => {
  try {
    const [coupleID] = await getCoupleID(ID);
    console.log(coupleID[0]);
    const [artwork] = await pool.query(
      "SELECT BIN_TO_UUID(artworkID) AS artworkID, BIN_TO_UUID(coupleID) AS coupleID, ID1, ID2, BIN_TO_UUID(emotionID1) AS emotionID1, BIN_TO_UUID(emotionID2) AS emotionID2, artworkPath, DATE_FORMAT(date, '%Y-%m-%d') AS date, title, description FROM Artwork WHERE coupleID = UUID_TO_BIN(?, 1)",
      [coupleID.coupleID]
    );
    console.log(artwork);
    return [artwork[0]];
  } catch (error) {
    console.error("Error getting artwork: ", error);
  }
}

const updateArtworkTitle = async (artworkID, newTitle) => {
  try {
    await pool.query(
      "UPDATE Artwork SET title = ? WHERE artworkID = UUID_TO_BIN(?, 1)",
      [newTitle, artworkID]
    );
    return true;
  } catch (error) {
    console.error("Error updating artwork title: ", error);
    return false;
  }
}

module.exports = {
  getCoupleID,
  getArtworks,
  updateArtworkTitle,
};