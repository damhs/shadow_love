// settingRouter.js
const express = require('express');
const {
  getIsShowed,
  updateIsShowed,
  deleteUser,
  deletePartnerUser,
  deleteCouple,
  deleteDiary,
  deleteEmotion,
  deleteArtwork,
} = require('../Services/settingService.js');

const settingRouter = express.Router();

settingRouter.get('/getIsShowed', async (req, res) => {
  const { ID } = req.query;
  try {
      const isShowed = await getIsShowed(ID);
      res.status(200).json(isShowed);
  } catch (error) {
      res.status(500).json({ error: "Failed to get isShowed" });
  }
});

settingRouter.patch('/updateIsShowed', async (req, res) => {
  const { ID, isShowed } = req.body;
  try {
      const updatedIsShowed = await updateIsShowed(ID, isShowed);
      res.status(200).json(updatedIsShowed);
  } catch (error) {
      res.status(500).json({ error: "Failed to update isShowed" });
  }
});

settingRouter.delete('/deleteUserData', async (req, res) => {
  const { ID } = req.query;
  try {
      await deleteUser(ID);
      await deletePartnerUser(ID);
      await deleteCouple(ID);
      await deleteDiary(ID);
      await deleteEmotion(ID);
      await deleteArtwork(ID);
      res.status(200).json({ message: "User data deleted" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete user data" });
  }
});

module.exports = settingRouter;