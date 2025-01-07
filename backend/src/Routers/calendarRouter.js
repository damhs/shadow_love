const express = require('express');
const {
  getEmotionColors,
} = require('../Services/calendarService.js');

const calendarRouter = express.Router();

calendarRouter.get('/getEmotionColors', async (req, res) => {
  const { ID } = req.query;
  try {
      const emotionColors = await getEmotionColors(ID);
      res.status(200).json(emotionColors);
  } catch (error) {
      res.status(500).json({ error: "Failed to get emotion colors" });
  }
});

module.exports = calendarRouter;