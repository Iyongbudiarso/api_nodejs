const express = require('express');
const multer = require('multer'); // https://github.com/expressjs/multer
const path = require('path');
const { validate } = require('../../lib').sessions.auth;
const { imageFilter } = require('../../lib').utils.fileType;

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, fileFilter: imageFilter });

router.post('/jpg', validate, upload.single('sampleFile'), (req, res) => {
  res.send('File uploaded!');
});

module.exports = router;
