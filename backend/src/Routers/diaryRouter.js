const express = require('express');
const {
  createQuestion,
  getRandomQuestion,
  createDiary,
} = require('../Services/diaryService.js');

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

diaryRouter.get('/getRandomQuestion', async (req, res) => {
  try {
    const [questionID, questionText] = await getRandomQuestion();
    res.status(200).json({ questionID, questionText });
  } catch (error) {
    res.status(500).json({ error: "Failed to get question" });
  }
});

diaryRouter.post('/createDiary', async (req, res) => {
  const { ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3 } = req.body;
  try {
    const diaryID = await createDiary(ID, questionID1, answerText1, questionID2, answerText2, questionID3, answerText3);
    res.status(200).json(diaryID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create diary" });
  }
});

module.exports = diaryRouter;