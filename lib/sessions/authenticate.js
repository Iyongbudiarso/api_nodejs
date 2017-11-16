const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const ErrorFactory = require('custom-errors/lib/error-factory');
const bcrypt = require('bcrypt');
const config = require('../../app/config/config');
const MUser = require('../../app/models/users');

const TokenError = ErrorFactory('Token', 'error', 403, true);

module.exports = {
  validate(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.secret_key, config.jwt_verify_options, (err, decoded) => {
        if (err) {
          next(new TokenError('token not valid'));
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token, return an error
      next(new TokenError('token was not found'));
    }
  },

  request_token(req, res, next) {
    return new Promise((resolve) => {
      MUser.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;

        if (!user) {
          resolve({ status: false });
        } else if (user) {
          bcrypt.compare(req.body.password, user.password, (err2, correctPassword) => {
            if (err2) return next(err2);

            if (correctPassword === false) resolve({ status: false });

            const payload = {
              role: user.role,
            };
            const token = jwt.sign(payload, config.secret_key, {
              expiresIn: config.jwt_expire_token * 60 * 60,
            });
            resolve({ status: true, token });
          });
        }
      });
    });
  },
};
