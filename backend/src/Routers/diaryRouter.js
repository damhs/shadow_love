const express = require('express');
const axios = require('axios');
const {
  createQuestion,
  getRandomQuestion,
  createDiary,
  getDiary,
  createEmotion,
  getEmotion,
} = require('../Services/diaryService.js');

const diaryRouter = express.Router();

async function getEmotionColorFromDiary(ID) {
  // DALL-E를 통한 감정 생성 요청
  const diary = await getDiary(ID);
  const [question1, answerText1, question2, answerText2, question3, answerText3] = diary;
  const dalleResponse = await axios.post('https://api.openai.com/v1/images/generations', {
    prompt: `Create a color that represents the emotions described: "${answerText1}, ${answerText2}, ${answerText3}"`,
    n: 1,
    size: '1024x1024',
  }, {
    headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
  });

  const emotionColor = dalleResponse.data.data[0].hex_color; // DALL-E가 생성한 색상
  return emotionColor;
}

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
    const [question] = await getRandomQuestion();
    res.status(200).json(question);
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

diaryRouter.get('/getDiary', async (req, res) => {
  const { ID, date } = req.query;
  try {
    const diary = await getDiary(ID, date);
    res.status(200).json(diary);
  } catch (error) {
    res.status(500).json({ error: "Failed to get diary" });
  }
});

diaryRouter.post('/createEmotion', async (req, res) => {
  const { ID } = req.body;
  try {
    const color = await getEmotionColorFromDiary(ID);
    const emotionID = await createEmotion(ID, color);
    res.status(200).json(emotionID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create emotion" });
  }
});

diaryRouter.get('/getEmotion', async (req, res) => {
  const { ID } = req.query;
  try {
    const emotion = await getEmotion(ID);
    const emotionColor = emotion[0].color;
    res.status(200).json(emotionColor);
  } catch (error) {
    res.status(500).json({ error: "Failed to get emotion color" });
  }
});

module.exports = diaryRouter;