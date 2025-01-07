// galleryService.js
const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getShowedCouples = async () => {
  try {
    const [coupleIDs] = await pool.query(
      "SELECT BIN_TO_UUID(coupleID) AS coupleID FROM Couple WHERE isShowed = 1",
    );
    return coupleIDs;
  } catch (error) {
    console.error("Error getting artworks: ", error);
  }
};

const getTodayArtworks = async (coupleID) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const [artworks] = await pool.query(
      "SELECT BIN_TO_UUID(artworkID) AS artworkID, BIN_TO_UUID(coupleID) AS coupleID, ID1, ID2, BIN_TO_UUID(emotionID1) AS emotionID1, BIN_TO_UUID(emotionID2) AS emotionID2, artworkPath, date, title, description FROM Artwork WHERE coupleID = UUID_TO_BIN(?, 1) AND date = ?",
      [coupleID, date]
    );
    return artworks;
  } catch (error) {
    console.error("Error getting artworks: ", error);
  }
}

module.exports = {
  getShowedCouples,
  getTodayArtworks,
};