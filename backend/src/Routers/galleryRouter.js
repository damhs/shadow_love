// galleryRouter.js
const express = require("express");
const {
  getShowedArtworks,
} = require("../Services/galleryService.js");

const galleryRouter = express.Router();

galleryRouter.get("/getShowedArtworks", async (req, res) => {
  try {
    const artworks = await getShowedArtworks();
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to get showed artworks" });
  }
});

module.exports = galleryRouter;