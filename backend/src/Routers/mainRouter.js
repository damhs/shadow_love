// mainRouter.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const Openai = require("openai");
const {
  createQuestion,
  getRandomQuestion,
  getQuestion,
  createDiary,
  getDiary,
  createEmotion,
  getEmotion,
  getColor,
  createArtwork,
} = require("../Services/mainService.js");

dotenv.config();

const openai = new Openai.OpenAI({ apikey: process.env.OPENAI_API_KEY });

const mainRouter = express.Router();

async function getEmotionColorFromDiary(ID) {
  // DALL-E를 통한 감정 생성 요청
  const diary = await getDiary(ID);
  const [
    questionID1,
    answerText1,
    questionID2,
    answerText2,
    questionID3,
    answerText3,
  ] = diary;
  const questionText1 = await getQuestion(questionID1);
  const questionText2 = await getQuestion(questionID2);
  const questionText3 = await getQuestion(questionID3);

  const dalleResponse = await axios.post(
    "https://api.openai.com/v1/artworks/generations",
    {
      prompt: `Create a color that represents the emotions described: "${answerText1}, ${answerText2}, ${answerText3}"`,
      n: 1,
      size: "1024x1024",
    },
    {
      headers: { Authorization: key },
    }
  );

  const emotionColor = dalleResponse.data.data[0].hex_color; // DALL-E가 생성한 색상
  return emotionColor;
}

async function getArtworkFromColor(color1, color2) {
  // DALL-E를 통한 작품 생성 요청
  const dalleResponse = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      prompt: `Create an artwork that combines the colors: "${color1}, ${color2}"`,
      n: 1,
      size: "1024x1024",
    },
    {
      headers: { Authorization: key },
    }
  );

  const artworkUrl = dalleResponse.data.data[0].url;

  // 이미지 다운로드 및 저장
  const artworkPath = path.join(__dirname, "artworks", `${artworkID}.png`);
  const artworkResponse = await axios.get(artworkUrl, {
    responseType: "arraybuffer",
  });
  fs.writeFileSync(artworkPath, artworkResponse.data);

  return artworkPath;
}

mainRouter.post("/createQuestion", async (req, res) => {
  const { questionText } = req.body;
  try {
    const questionID = await createQuestion(questionText);
    res.status(200).json(questionID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create question" });
  }
});

mainRouter.get("/getRandomQuestion", async (req, res) => {
  try {
    const [question] = await getRandomQuestion();
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to get question" });
  }
});

mainRouter.post("/createDiary", async (req, res) => {
  const {
    ID,
    questionID1,
    answerText1,
    questionID2,
    answerText2,
    questionID3,
    answerText3,
  } = req.body;
  try {
    const diaryID = await createDiary(
      ID,
      questionID1,
      answerText1,
      questionID2,
      answerText2,
      questionID3,
      answerText3
    );
    res.status(200).json(diaryID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create diary" });
  }
});

mainRouter.get("/getDiary", async (req, res) => {
  const { ID, date } = req.query;
  try {
    const diary = await getDiary(ID, date);
    res.status(200).json(diary);
  } catch (error) {
    res.status(500).json({ error: "Failed to get diary" });
  }
});

mainRouter.post("/createEmotion", async (req, res) => {
  const { ID } = req.body;
  try {
    const color = await getEmotionColorFromDiary(ID);
    const emotionID = await createEmotion(ID, color);
    res.status(200).json(emotionID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create emotion" });
  }
});

mainRouter.get("/getEmotion", async (req, res) => {
  const { ID } = req.query;
  try {
    const emotion = await getEmotion(ID);
    const emotionColor = emotion[0].color;
    res.status(200).json(emotionColor);
  } catch (error) {
    res.status(500).json({ error: "Failed to get emotion color" });
  }
});

mainRouter.post("/createArtwork", async (req, res) => {
  const { ID1, ID2 } = req.body;
  try {
    const emotionID1 = await getEmotion(ID1);
    const emotionID2 = await getEmotion(ID2);
    const color1 = await getColor(ID1);
    const color2 = await getColor(ID2);
    const artworkPath = await getArtworkFromColor(color1, color2);
    const artworkID = await createArtwork(
      ID1,
      ID2,
      emotionID1,
      emotionID2,
      artworkPath
    );
    res.status(200).json(artworkID);
  } catch (error) {
    res.status(500).json({ error: "Failed to create artwork" });
  }
});

mainRouter.post("/openai-dalle", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    res.status(200).json(response.data[0].url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mainRouter.post("/openai-gpt", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs HEX color codes for emotions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });
    res.status(200).json(response["choices"][0]["message"]["content"]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = mainRouter;
