const express = require('express');
const MUser = require('../models/users');

const router = express.Router();

router.route('/')

  .get((req, res, next) => {
    MUser.find({}, (err, rslt) => {
      const users = rslt;
      if (err) {
        return next(err);
      }
      res.json(users);
    });
  })

  .post((req, res, next) => {
    const user = new MUser(); // create a new instance of the user model
    user.full_name = req.body.full_name; // set the users name (comes from the request)
    user.email = req.body.email; // set the users name (comes from the request)
    user.password = req.body.password; // set the users name (comes from the request)

    // save the user and check for errors
    user.save((err) => {
      if (err) return next(err);

      res.json({ message: 'User created!' });
    });
  });

// MIDDLEWARE Check User ID
router.use('/:userId', (req, res, next) => {
  MUser.findById(req.params.userId, (err, row) => {
    if (err || !row) {
      const error = err || {};
      error.status = 404;
      error.message = 'User Not Found';
      return next(error);
    }

    req.user = row;

    return next();
  });
});

router.route('/:userId')

  .get((req, res) => {
    const { user } = req;
    res.json(user);
  })

  .put((req, res, next) => {
    const { user } = req;

    user.full_name = req.body.full_name; // set the users name (comes from the request)
    user.email = req.body.email; // set the users name (comes from the request)
    user.password = req.body.password; // set the users name (comes from the request)

    // save the user
    user.save((err) => {
      if (err) return next(err);

      res.json({ message: 'User updated!' });
    });
  })

  .delete((req, res, next) => {
    // use our user model to find the user we want
    MUser.remove({ _id: req.params.userId }, (err) => {
      if (err) {
        const error = err;
        error.status = 404;
        error.message = 'User Not Found';
        return next(error);
      }

      res.json({ message: 'User deleted!' });
    });
  });

module.exports = router;
