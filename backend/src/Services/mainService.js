// mainService.js
const pool = require("../mysql.js");
const uuid = require("uuid-sequential");

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

const getQuestion = async (questionID) => {
  try {
    const questionText = await pool.query(
      "SELECT questionText FROM Question WHERE questionID = UUID_TO_BIN(?, 1)",
      [questionID]
    );
    return questionText;
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
    const date = new Date().toISOString().split("T")[0];
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
        date,
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
      "SELECT BIN_TO_UUID(diaryID) AS diaryID, ID, BIN_TO_UUID(questionID1) AS questionID1, answerText1, BIN_TO_UUID(questionID2) AS questionID2, answerText2, BIN_TO_UUID(questionID3) AS questionID3, answerText3 FROM Diary WHERE ID = ? AND date = ?",
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
    const date = new Date().toISOString().split("T")[0];
    const diary = await getDiary(ID, date);
    const diaryID = diary[0].diaryID;
    console.log('diaryID:', diaryID);
    await pool.query(
      "INSERT INTO Emotion (emotionID, diaryID, ID, color, date) VALUES (UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1), ?, ?, ?)",
      [emotionID, diaryID, ID, color, date]
    );
    return emotionID;
  } catch (error) {
    console.error("Error creating emotion: ", error);
  }
};

const getEmotion = async (ID) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const [emotion] = await pool.query(
      "SELECT BIN_TO_UUID(emotionID) AS emotionID, ID, BIN_TO_UUID(diaryID), color, date FROM Emotion WHERE ID = ? AND date = ?",
      [ID, date]
    );
    return emotion;
  } catch (error) {
    console.error("Error getting emotion: ", error);
  }
};

const getColor = async (ID) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const [color] = await pool.query(
      "SELECT color FROM Emotion WHERE ID = ? AND date = ?",
      [ID, date]
    );
    return color[0].color;
  } catch (error) {
    console.error("Error getting color: ", error);
  }
}

const createArtwork = async (ID1, ID2, emotionID1, emotionID2, artworkPath) => {
  try {
    const artworkID = uuid();
    const date = new Date().toISOString().split("T")[0];
    const [coupleID] = await pool.query("SELECT coupleID FROM Couple WHERE ID1 = ? OR ID2 = ?", [ID1, ID1]);
    console.log('coupleID:', coupleID);
    await pool.query(
      "INSERT INTO Artwork (artworkID, coupleID, ID1, ID2, emotionID1, emotionID2, artworkPath, date) VALUES (UUID_TO_BIN(?, 1), ?, ?, ?, ?, ?, ?, ?)",
      [
        artworkID,
        coupleID,
        ID1,
        ID2,
        emotionID1,
        emotionID2,
        artworkPath,
        date,
      ]
    );
    return artworkID;
  } catch (error) {
    console.error("Error creating artwork: ", error);
  }
}

module.exports = {
  createQuestion,
  getQuestion,
  getRandomQuestion,
  createDiary,
  getDiary,
  createEmotion,
  getEmotion,
  getColor,
  createArtwork,
};
