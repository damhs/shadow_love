// mainRouter.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const Openai = require("openai");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid-sequential");
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

async function useGPT(prompt, retries = 3) {
  if (retries <= 0) {
    throw new Error("Failed to generate a valid HEX color after multiple attempts.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs HEX color codes for emotions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    const color = response["choices"][0]["message"]["content"];

    // HEX color 검증 및 무채색 여부 확인
    const isValidHex = /^#([0-9A-F]{6})$/i.test(color);
    const isNeutralColor =
      color.toLowerCase() === "#808080" ||
      color.toLowerCase() === "#ffffff" ||
      color.toLowerCase() === "#000000";

    if (isValidHex && !isNeutralColor) {
      return color;
    } else {
      console.warn(`Invalid or neutral color generated: ${color}. Retrying...`);
      return useGPT(prompt, retries - 1); // 재귀 호출
    }
  } catch (error) {
    console.error("Error using GPT: ", error);
    throw new Error("Failed to generate HEX color due to an API error.");
  }
}

async function useDallE(prompt, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      return response.data[0].url; // Successfully generated image URL
    } catch (error) {
      attempt++;
      console.error(`Error using DALL-E (Attempt ${attempt}): `, error.message);

      // If max retries reached, throw error
      if (attempt >= maxRetries) {
        console.error("Max retries reached. Unable to generate image.");
        throw error; // Re-throw the error to be handled by the caller
      }

      // Optional: Add a delay between retries
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }
  }
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

async function getEmotionColorFromDiary(ID) {
  // GPT를 통한 감정 색상 생성 요청
  const date = new Date().toISOString().split("T")[0];
  const diary = await getDiary(ID, date);
  console.log('questionID1:', diary[0].questionID1);
  const questionText1 = await getQuestion(diary[0].questionID1);
  const questionText2 = await getQuestion(diary[0].questionID2);
  const questionText3 = await getQuestion(diary[0].questionID3);
  console.log('diary:', diary[0]);

  const prompt = `You are an expert in mapping emotions to colors. Based on the following questions and answers, provide a single vibrant HEX color code that reflects the dominant emotional tone conveyed in the responses. Avoid neutral or grayscale colors like #808080, #FFFFFF, or #000000. The selected color should:

1. Exaggerate the emotion expressed in the answers.
2. Be associated with the strongest feeling (e.g., joy, sadness, anger, love, or excitement).
3. Be distinct and vibrant (e.g., bright red for passion, deep blue for calmness, or bright yellow for happiness).

You are an expert in analyzing Korean text and mapping emotions to colors. Based on the following Korean questions and answers, identify the dominant emotion conveyed in the answers, and then provide a vibrant HEX color code that matches this emotion. Avoid neutral or grayscale colors like #808080, #FFFFFF, or #000000. The result should be vivid and associated with the strongest emotion.

Questions and answers (in Korean):
Question 1: ${questionText1}
Answer 1: ${diary[0].answerText1}

Question 2: ${questionText2}
Answer 2: ${diary[0].answerText2}

Question 3: ${questionText3}
Answer 3: ${diary[0].answerText3}

Provide your response in this exact format, with no additional text:
#XXXXXX`;
  const emotionColor = await useGPT(prompt);
  return emotionColor;
}

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
  console.log('ID:', ID);
  try {
    const emotion = await getEmotion(ID);
    // const emotionColor = emotion[0].color;
    console.log('emotion:', emotion);
    res.status(200).json(emotion);
  } catch (error) {
    res.status(500).json({ error: "Failed to get emotion color" });
  }
});

async function getArtworkFromCouple(ID1, ID2) {
  // DALL-E를 통한 작품 생성 요청
  console.log('getArtworkFromCouple');
  const date = new Date().toISOString().split("T")[0];

  const diary1 = await getDiary(ID1, date);
  console.log('diary1: ', diary1);
  const questionText11 = await getQuestion(diary1.questionID1);
  const questionText12 = await getQuestion(diary1.questionID2);
  const questionText13 = await getQuestion(diary1.questionID3);
  const color1 = await getColor(ID1);
  console.log('color1:', color1);

  const diary2 = await getDiary(ID2, date);
  console.log('diary2: ', diary2);
  const questionText21 = await getQuestion(diary2.questionID1);
  const questionText22 = await getQuestion(diary2.questionID2);
  const questionText23 = await getQuestion(diary2.questionID3);
  const color2 = await getColor(ID2);
  console.log('color2:', color2);

  const prompt = `Based on the following questions, answers, and color of 2 users, create an artwork that represents the emotions conveyed in the responses:\n\nUser 1:\nQuestion 1:${questionText11}\nAnswer 1: ${diary1.answerText1}\nQuestion 2: ${questionText12}\nAnswer 2: ${diary1.answerText2}\nQuestion 3: ${questionText13}\nAnswer 3: ${diary1.answerText3}\nColor: ${color1}\n\nUser 2:\nQuestion 1:${questionText21}\nAnswer 1: ${diary2.answerText1}\nQuestion 2: ${questionText22}\nAnswer 2: ${diary2.answerText2}\nQuestion 3: ${questionText23}\nAnswer 3: ${diary2.answerText3}\nColor: ${color2}\n\n
Please use only the colors I provided as much as possible.`;
  
  const artworkUrl = await useDallE(prompt);
  console.log('artworkUrl:', artworkUrl);

  const artworkName = uuid();
  // 이미지 다운로드 및 저장
  const artworkPath = path.join(__dirname, "artworks", `${artworkName}.png`);
  console.log('artworkPath:', artworkPath);
  const artworkResponse = await axios.get(artworkUrl, {
    responseType: "arraybuffer",
  });
  console.log('artworkResponse:', artworkResponse);
  fs.writeFileSync(artworkPath, artworkResponse.data);
  console.log('writeFileSync');

  return artworkPath;
}

mainRouter.post("/createArtwork", async (req, res) => {
  const { ID1, ID2 } = req.body;
  try {
    const emotionID1 = await getEmotion(ID1);
    console.log('emotionID1:', emotionID1[0]);
    const emotionID2 = await getEmotion(ID2);
    console.log('emotionID2:', emotionID2[0]);
    const artworkPath = await getArtworkFromCouple(ID1, ID2);
    console.log('artworkPath:', artworkPath);
    const artworkID = await createArtwork(
      ID1,
      ID2,
      emotionID1,
      emotionID2,
      artworkPath
    );
    console.log('artworkID:', artworkID);
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
