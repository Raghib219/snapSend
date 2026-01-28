const express = require('express');
const multer = require('multer');
const csvParser = require('../utils/csvParser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('csv'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer.toString();
    const parsedData = await csvParser(fileBuffer);
    res.json(parsedData);
  } catch (err) {
    console.error("Parsing error:", err);
    res.status(500).json({ error: "Error parsing CSV" });
  }
});

module.exports = router;
