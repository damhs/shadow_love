const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

const getDate = () => {
  const date = new Date();

  const year = date.getFullYear(); // Get the full year (e.g., 2025)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1 and pad with zero
  const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month and pad with zero

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const createQuestion = async (questionText) => {
  try {
    const questionID = uuid();
    await pool.query(
      "INSERT INTO Question (questionID, questionText) VALUES (UUID_TO_BIN(?, 1), ?)",
      [questionID, questionText]
    );
    return questionID;
  } catch (error) {
    console.error("Error creating question: ", error);
  }
};

const getRandomQuestion = async () => {
  try {
    const [question] = await pool.query(
      "SELECT BIN_TO_UUID(questionID) AS questionID, questionText FROM Question ORDER BY RAND() LIMIT 1"
    );
    return [question[0]];
  } catch (error) {
    console.error("Error getting question: ", error);
  }
};

const createDiary = async (
  ID,
  questionID1,
  answerText1,
  questionID2,
  answerText2,
  questionID3,
  answerText3
) => {
  try {
    const diaryID = uuid();
    const formattedDate = getDate();
    await pool.query(
      "INSERT INTO Diary (diaryID, ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3, date) VALUES (UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?, ?)",
      [
        diaryID,
        ID,
        questionID1,
        answerText1,
        questionID2,
        answerText2,
        questionID3,
        answerText3,
        formattedDate,
      ]
    );
    return diaryID;
  } catch (error) {
    console.error("Error creating diary: ", error);
  }
};

const getDiary = async (ID, date) => {
  try {
    const [diary] = await pool.query(
      "SELECT BIN_TO_UUID(diaryID) AS diaryID, ID, BIN_TO_UUID(questionID1) AS questionID1, answerText1, BIN_TO_UUID(questionID2) AS questionID2, answerText2, BIN_TO_UUID(questionID3) AS questionID3, answerText3, date FROM Diary WHERE ID = UUID_TO_BIN(?, 1) AND date = ?",
      [ID, date]
    );
    return diary;
  } catch (error) {
    console.error("Error getting diary: ", error);
  }
};

const createEmotion = async (ID, color) => {
  try {
    const emotionID = uuid();
    const diary = await getDiary(ID);
    const [diaryID] = diary;
    const formattedDate = getDate();
    await pool.query(
      "INSERT INTO Emotion (emotionID, diaryID, ID, color, date) VALUES (UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1), ?, ?, ?)",
      [emotionID, diaryID, ID, color, formattedDate]
    );
    return emotionID;
  } catch (error) {
    console.error("Error creating emotion: ", error);
  }
};

const getEmotion = async (ID, date) => {
  try {
    const [emotioin] = await pool.query(
      "SELECT BIN_TO_UUID(emotionID) AS emotionID, ID, BIN_TO_UUID(diaryID), color, date FROM Diary WHERE ID = UUID_TO_BIN(?, 1) AND date = ?",
      [ID, date]
    );
  } catch (error) {
    console.error("Error getting emotion: ", error);
  }
};

const getColor = async (ID) => {
  try {
    const formattedDate = getDate();
    const [color] = await pool.query(
      "SELECT color FROM Emotion WHERE ID = ? AND date = ?",
      [ID, formattedDate]
    );
    return color[0].color;
  } catch (error) {
    console.error("Error getting color: ", error);
  }
}

const createArtwork = async (ID1, ID2, emotionID1, emotionID2, artworkPath) => {
  try {
    const artworkID = uuid();
    const formattedDate = getDate();
    await pool.query(
      "INSERT INTO Artwork (artworkID, ID1, ID2, emotionID1, emotionID2, artworkPath, date) VALUES (UUID_TO_BIN(?, 1), ?, ?, ?, ?, ?, ?)",
      [
        artworkID,
        ID1,
        ID2,
        emotionID1,
        emotionID2,
        artworkPath,
        formattedDate,
      ]
    );
    return artworkID;
  } catch (error) {
    console.error("Error creating artwork: ", error);
  }
}

module.exports = {
  createQuestion,
  getRandomQuestion,
  createDiary,
  getDiary,
  createEmotion,
  getEmotion,
  getColor,
  createArtwork,
};
