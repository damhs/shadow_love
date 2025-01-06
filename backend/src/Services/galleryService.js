// galleryService.js
const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getShowedArtworks = async () => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const [artworks] = await pool.query(
      "SELECT BIN_TO_UUID(artworkID), coupleID, title, description FROM Artwork WHERE coupleID = (SELECT coupleID FROM Couple WHERE isShowed = true)"
    );
    return artworks;
  } catch (error) {
    console.error("Error getting artworks: ", error);
  }
};

module.exports = {
  getShowedArtworks,
};