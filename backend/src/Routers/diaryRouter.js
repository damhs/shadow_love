const express = require('express');
const {
  createQuestion,
  createAnswer,
  createEmotion,
  getRandomQuestion,
} = require('../Services/diaryService.js');
const { getUserID } = require('../Services/authService.js');

const diaryRouter = express.Router();

diaryRouter.post('/createQuestion', async (req, res) => {
  const { questionText } = req.body;
  try {
    const questionID = await createQuestion(questionText);
    res.status(200).json(questionID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create question" });
  }
});

diaryRouter.post('/createAnswer', async (req, res) => {
  const { answerText } = req.body;
  try {
    const answerID = await createAnswer(answerText);
    res.status(200).json(answerID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create answer" });
  }
});

diaryRouter.post('/createEmotion', async (req, res) => {
  const { questionID, answerID, questionID2, answerID2, questionID3, answerID3 } = req.body;
  const userID = await getUserID(req.headers.authorization);
  try {
    const emotionID = await createEmotion(userID, questionID, answerID, questionID2, answerID2, questionID3, answerID3);
    res.status(200).json(emotionID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create emotion" });
  }
});

diaryRouter.get('/getRandomQuestion', async (req, res) => {
  try {
    const questionText = await getRandomQuestion();
    res.status(200).json(questionText);
  } catch (error) {
    res.status(500).json({ error: "Failed to get question" });
  }
});

module.exports = diaryRouter;