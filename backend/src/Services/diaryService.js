const pool = require('../mysql.js');

const createQuestion = async (questionText) => {
  try {
    await pool.query('INSERT INTO Question (questionID, questionText) VALUES (UUID_TO_BIN(UUID(), 1), ?)', [questionText]);
  } catch (error) {
    console.error('Error creating question: ', error);
  }
}

const createAnswer = async (answerText) => {
  try {
    await pool.query('INSERT INTO Answer (answerID, answerText) VALUES (UUID_TO_BIN(UUID(), 1), ?)', [answerText]);
  } catch (error) {
    console.error('Error creating answer: ', error);
  }
}

const getQuestion = async () => {
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
  getQuestion,
}