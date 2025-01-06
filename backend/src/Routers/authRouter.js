const express = require('express');
const crypto = require('crypto');
const {
    createUser,
    getUser,
    getAllUserID,
    getCouple,
    deleteUser,
    updateCouple,
} = require('../Services/authService.js');

const authRouter = express.Router();

function generateCoupleRegisterID(ID) {
  console.log(ID);
  const hash = crypto.createHash("md5").update(ID).digest("hex"); // MD5 해시
  console.log(parseInt(hash.substring(0, 8), 16) % 1000000);
  return parseInt(hash.substring(0, 8), 16) % 1000000; // 6자리 숫자 생성
}

async function findIDByCoupleRegisterID(coupleregisterID) {
  const allUserID = await getAllUserID();
  for (const ID of allUserID) {
      if (generateCoupleRegisterID(ID) === coupleregisterID) {
          return ID;
      }
  }
  throw new Error("No matching ID found for the given code");
}

authRouter.post('/createUser', async (req, res) => {
  const { ID } = req.body;
  try {
      console.log(ID);
      await createUser(ID);
      res.status(200).json({ message: "User created" });
  } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
  }
});

authRouter.get('/getUser', async (req, res) => {
  const { ID } = req.query;
  try {
      const user = await getUser(ID);
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
  }
});

authRouter.get('/getCoupleRegisterID', async (req, res) => {
  const { ID } = req.query;
  try {
      console.log(ID);
      const coupleRegisterID = generateCoupleRegisterID(ID);
      console.log(coupleRegisterID);
      res.status(200).json(coupleRegisterID);
  } catch (error) {
      res.status(500).json({ error: "Failed to get couple register ID" });
  }
});

authRouter.get('/getCouple', async (req, res) => {
  const { ID } = req.query;
  try {
      const coupleID = await getCouple(ID);
      res.status(200).json(coupleID);
  } catch (error) {
      res.status(500).json({ error: "Failed to get couple" });
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

authRouter.patch('/updateCouple', async (req, res) => {
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