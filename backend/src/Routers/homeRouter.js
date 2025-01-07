const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const {
  getCoupleID,
  getArtworks,
} = require('../Services/homeService.js');

const homeRouter = express.Router();

homeRouter.get('/getCoupleID', async (req, res) => {
  const { ID } = req.query;
  try {
      const coupleID = await getCoupleID(ID);
      res.status(200).json(coupleID);
  } catch (error) {
      res.status(500).json({ error: "Failed to get couple" });
  }
});

homeRouter.get('/getArtworks', async (req, res) => {
  const { ID } = req.query;
  try {
      const artworks = await getArtworks(ID);
      // artworkPath를 사용하여 파일을 읽고 artwork로 변환
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
      res.status(500).json({ error: "Failed to get artwork" });
  }
});

module.exports = homeRouter;