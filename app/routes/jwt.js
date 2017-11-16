const express = require('express');
const { auth } = require('../../lib').sessions;

const router = express.Router();

router.post('/request-token', (req, res, next) => {
  auth.request_token(req, res, next).then((requestToken) => {
    if (requestToken.status !== true) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      res.json({ success: true, message: 'Enjoy your token.', token: requestToken.token });
    }
  });
});

module.exports = router;
