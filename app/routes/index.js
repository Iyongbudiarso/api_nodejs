const express = require('express');
const { validate } = require('../../lib').sessions.auth;

const router = express.Router();

/* GET home page. */
router.get('/', validate, (req, res) => {
  res.json('ini index');
});

module.exports = router;
