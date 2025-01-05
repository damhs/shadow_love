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

const createAnswer = async (answerText) => {
  try {
    const answerID = uuid();
    await pool.query('INSERT INTO Answer (answerID, answerText) VALUES (UUID_TO_BIN(?, 1), ?)', [answerID, answerText]);
    return answerID;
  } catch (error) {
    console.error('Error creating answer: ', error);
  }
}

const createEmotion = async (getUserID, questionID, answerID, questionID2, answerID2, questionID3, answerID3) => {
  try {
    const emotionID = uuid();
    await pool.query('INSERT INTO Emotion (emotionID, userID, questionID, answerID, questionID2, answerID2, questionID3, answerID3) VALUES (UUID_TO_BIN(?, 1), ?, ?, ?, ?, ?, ?, ?)', [emotionID, getUserID, questionID, answerID, questionID2, answerID2, questionID3, answerID3]);
    return emotionID;
  } catch (error) {
    console.error('Error creating emotion: ', error);
  }
}

const getRandomQuestion = async () => {
  try {
    const [questionText] = await pool.query('SELECT questionText FROM Question ORDER BY RAND() LIMIT 1');
    return questionText;
  } catch (error) {
    console.error('Error getting question: ', error);
  }
}


module.exports = {
  createQuestion,
  createAnswer,
  createEmotion,
  getRandomQuestion,
}