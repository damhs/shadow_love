// galleryRouter.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const {
  getShowedCouples,
  getTodayArtworks,
} = require("../Services/galleryService.js");

const galleryRouter = express.Router();

galleryRouter.get("/getShowedCouples", async (req, res) => {
  try {
    const coupleIDs = await getShowedCouples();
    res.status(200).json(coupleIDs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get showed coupleIDs" });
  }
});

galleryRouter.get("/getTodayArtworks", async (req, res) => {
  const { coupleID } = req.query;
  try {
    const artworks = await getTodayArtworks(coupleID);
    const updatedArtworks = await Promise.all(artworks.map(async (artwork) => {
          try {
            const artworkBuffer = await fs.readFile(path.resolve(artwork.artworkPath)); // 파일 읽기
            const artworkBase64 = artworkBuffer.toString('base64'); // Base64 인코딩
            return {
              ...artwork,
              artwork: `data:image/png;base64,${artworkBase64}`, // artwork 추가
              artworkPath: undefined, // artworkPath 제거
            };
          } catch (fileError) {
            console.error(`Failed to read artwork file: ${artwork.artworkPath}`, fileError);
            return {
              ...artwork,
              artwork: null, // 파일 읽기 실패 시 null
              artworkPath: undefined, // artworkPath 제거
            };
          }
        }));
    res.status(200).json(updatedArtworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to get today's artworks" });
  }
});

module.exports = galleryRouter;