const express = require('express');
const crypto = require('crypto');
const {
    createUser,
    getUser,
    getAllUserID,
    getCouple,
    deleteUser,
    updateCouple,
    createCouple,
    deleteDuplicateCouple,
} = require('../Services/authService.js');

const authRouter = express.Router();

function generateCoupleRegisterID(ID) {
  const hash = crypto.createHash("md5").update(ID).digest("hex");
  const number = parseInt(hash.substring(0, 8), 16) % 1000000;
  return number.toString().padStart(6, "0");
}

async function findIDByCoupleRegisterID(coupleregisterID) {
  const allUserID = await getAllUserID();
  for (const user of allUserID) {
    const { ID } = user;
    decodedCoupleRegisterID = generateCoupleRegisterID(ID);
    if (generateCoupleRegisterID(ID) === coupleregisterID) {
      return ID;
    }
  }
  throw new Error("No matching ID found for the given code");
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
      const coupleRegisterID = generateCoupleRegisterID(ID);
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
  const { ID, coupleRegisterID } = req.body;
  try {
      const coupleID = await findIDByCoupleRegisterID(coupleRegisterID);
      console.log(coupleID);
      await updateCouple(ID, coupleID);
      await updateCouple(coupleID, ID);
      await createCouple(ID, coupleID);
      await deleteDuplicateCouple(ID, coupleID);
      res.status(200).json(coupleID);
  } catch (error) {
      res.status(500).json({ error: "Failed to update couple" });
  }
});

module.exports = authRouter;