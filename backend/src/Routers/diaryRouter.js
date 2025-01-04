const express = require('express');
const {
  createQuestion,
  createAnswer,
  getQuestion,
} = require('../Services/diaryService.js');

const diaryRouter = express.Router();

diaryRouter.post('/createQuestion', async (req, res) => {
  const { questionText } = req.body;
  try {
    await createQuestion(questionText);
    res.status(200).json({ message: "Question created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create question" });
  }
});

diaryRouter.post('/createAnswer', async (req, res) => {
  const { answerText } = req.body;
  try {
    await createAnswer(answerText);
    res.status(200).json({ message: "Answer created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create answer" });
  }
});

diaryRouter.get('/getQuestion', async (req, res) => {
  try {
    const questionText = await getQuestion();
    res.status(200).json(questionText);
  } catch (error) {
    res.status(500).json({ error: "Failed to get question" });
  }
});

module.exports = diaryRouter;