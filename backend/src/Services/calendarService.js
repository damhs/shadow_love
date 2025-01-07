const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getEmotionColors = async (ID) => {
  try {
    const [emotions] = await pool.query(
      "SELECT BIN_TO_UUID(emotionID) AS emotionID, color, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM Emotion WHERE ID = ?",
      [ID]
    );
    return emotions;
  } catch (error) {
    console.error("Error getting emotion colors: ", error);
  }
}

module.exports = {
  getEmotionColors,
};