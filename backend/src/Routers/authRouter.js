const express = require('express');
const crypto = require('crypto');
const {
    createUser,
    getUser,
    getAllUserID,
    deleteUser,
    updateCouple,
} = require('../Services/authService.js');

const authRouter = express.Router();

function generateCoupleRegisterID(deviceID) {
  const crypto = require("crypto");
  const hash = crypto.createHash("md5").update(deviceID).digest("hex"); // MD5 해시
  return parseInt(hash.substring(0, 8), 16) % 1000000; // 6자리 숫자 생성
}

async function findIDByCoupleRegisterID(coupleregisterID) {
  const allUserID = await getAllUserID();
  for (const ID of allUserID) {
      if (generateCoupleRegisterID(ID) === coupleregisterID) {
          return ID;
      }
  }
  throw new Error("No matching deviceID found for the given code");
}

authRouter.post('/createUser', async (req, res) => {
  const { ID } = req.body;
  try {
      await createUser(ID);
      res.status(200).json({ message: "User created" });
  } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
  }
});

authRouter.get('/getUser', async (req, res) => {
  const { ID } = req.body;
  try {
      const user = await getUser(ID);
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
  }
});

authRouter.delete('/deleteUser', async (req, res) => {
  const { ID } = req.body;
  try {
      await deleteUser(ID);
      res.status(200).json({ message: "User deleted" });
  } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
  }
});

authRouter.put('/updateCouple', async (req, res) => {
  const { ID, coupleregisterID } = req.body;
  try {
      const coupleID = await findIDByCoupleRegisterID(coupleregisterID);
      await updateCouple(ID, coupleID);
      res.status(200).json({ message: "Couple updated" });
  } catch (error) {
      res.status(500).json({ error: "Failed to update couple" });
  }
});

module.exports = authRouter;