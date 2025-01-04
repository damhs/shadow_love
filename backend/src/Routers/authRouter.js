const express = require('express');
const {
  getUserID,
  getPassword,
  createUser,
  createKakaoUser,
} = require('../Services/authService.js');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.get('/login', async (req, res) => {
  const { id, password } = req.query;
  try {
      const hashedPassword = await getPassword(id);
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
      res.status(200).json(isPasswordMatch);
  } catch (error) {
      res.status(500).json({ error: "Failed to login" });
  }
});

authRouter.post('/signUp', async (req, res) => {
  const { name, id, password } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser(name, id, hashedPassword);
      res.status(200).json({ message: "User created" });
  } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
  }
});

authRouter.post('/kakaoSignUp', async (req, res) => {
  const { name, email } = req.body;
  try {
      await createKakaoUser(name, email);
      res.status(200).json({ message: "Kakao user created" });
  } catch (error) {
      res.status(500).json({ error: "Failed to create kakao user" });
  }
});



module.exports = authRouter;