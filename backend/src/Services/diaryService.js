const pool = require('../mysql.js');
const uuid = require('uuid-sequential');

const createQuestion = async (questionText) => {
  try {
    const questionID = uuid();
    await pool.query('INSERT INTO Question (questionID, questionText) VALUES (UUID_TO_BIN(?, 1), ?)', [questionID, questionText]);
    return questionID;
  } catch (error) {
    console.error('Error creating question: ', error);
  }
}

const getRandomQuestion = async () => {
  try {
    const [questionID, questionText] = await pool.query('SELECT BIN_TO_UUID(questionID), questionText FROM Question ORDER BY RAND() LIMIT 1');
    return [questionID, questionText];
  } catch (error) {
    console.error('Error getting question: ', error);
  }
}

const createDiary = async (ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3) => {
  try {
    const diaryID = uuid();
    await pool.query('INSERT INTO Diary (diaryID, ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3) VALUES (UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?, UUID_TO_BIN(?, 1), ?)', [diaryID, ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3]);
    return diaryID;
  } catch (error) {
    console.error('Error creating diary: ', error);
  }
}

module.exports = {
  createQuestion,
  getRandomQuestion,
  createDiary,
}