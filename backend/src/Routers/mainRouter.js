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

async function useGPT(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs HEX color codes for emotions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });
    return response["choices"][0]["message"]["content"];
  } catch (error) {
    console.error("Error using GPT: ", error);
  }
}

async function useDallE(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    return response.data[0].url;
  } catch (error) {
    console.error("Error using DALL-E: ", error);
  }
}

async function getEmotionColorFromDiary(ID) {
  // GPT를 통한 감정 색상 생성 요청
  const date = new Date().toISOString().split("T")[0];
  const diary = await getDiary(ID, date);
  const [
    diaryID,
    _ID,
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

  const prompt = `Based on the following questions and answers, suggest a HEX color code that represents the overall emotion conveyed in the responses:\n\nQuestion 1:${questionText1}\nAnswer 1: ${answerText1}\nQuestion 2: ${questionText2}\nAnswer 2: ${answerText2}\nQuestion 3: ${questionText3}\nAnswer 3: ${answerText3}\n\nProvide the result in this format: #XXXXXX`;
  const emotionColor = await useGPT(prompt);
  return emotionColor;
}

async function getArtworkFromCouple(ID1, ID2) {
  // DALL-E를 통한 작품 생성 요청
  const date = new Date().toISOString().split("T")[0];
  const diary1 = await getDiary(ID1, date);
  const [
    diaryID1,
    _ID1,
    questionID11,
    answerText11,
    questionID12,
    answerText12,
    questionID13,
    answerText13,
  ] = diary1;
  const questionText11 = await getQuestion(questionID11);
  const questionText12 = await getQuestion(questionID12);
  const questionText13 = await getQuestion(questionID13);
  const color1 = await getColor(ID1);

  const diary2 = await getDiary(ID1, date);
  const [
    diaryID2,
    _ID2,
    questionID21,
    answerText21,
    questionID22,
    answerText22,
    questionID23,
    answerText23,
  ] = diary1;
  const questionText21 = await getQuestion(questionID21);
  const questionText22 = await getQuestion(questionID22);
  const questionText23 = await getQuestion(questionID23);
  const color2 = await getColor(ID2);

  const prompt = `Based on the following questions, answers, and color of 2 users, create an artwork that represents the emotions conveyed in the responses:\n\nUser 1:\nQuestion 1:${questionText11}\nAnswer 1: ${answerText11}\nQuestion 2: ${questionText12}\nAnswer 2: ${answerText12}\nQuestion 3: ${questionText13}\nAnswer 3: ${answerText13}\nColor: ${color1}\n\nUser 2:\nQuestion 1:${questionText21}\nAnswer 1: ${answerText21}\nQuestion 2: ${questionText22}\nAnswer 2: ${answerText22}\nQuestion 3: ${questionText23}\nAnswer 3: ${answerText23}\nColor: ${color2}\n\n
Please use only the colors I provided as much as possible.`;
  
  const artworkUrl = await useDallE(prompt);

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
  const { ID } = req.query;
  const date = new Date().toISOString().split("T")[0];
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
    console.log('color:', color);
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
    // const emotionColor = emotion[0].color;
    res.status(200).json(emotion);
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
