const express = require('express');
const {
    createCouple,
} = require('../Services/coupleService.js');

const coupleRouter = express.Router();

coupleRouter.post('/createCouple', async (req, res) => {
  const { id1, id2 } = req.body;
  const userID1 = await getUserID(id1);
  const userID2 = await getUserID(id2);
  try {
      await createCouple(userID1, userID2);
      res.status(200).json({ message: "Couple created" });
  } catch (error) {
      res.status(500).json({ error: "Failed to create couple" });
  }
});

module.exports = coupleRouter;