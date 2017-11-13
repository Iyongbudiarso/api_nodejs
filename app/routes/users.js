var express = require('express');
var router = express.Router();

var user_model = require('../models/users');

router.route('/')

    .get(function(req, res) {
        user_model.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    })

    .post(function(req, res) {

        var user = new user_model();      // create a new instance of the Bear model
        user.name = req.body.name;  // set the users name (comes from the request)

        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!'});
        });

    });



module.exports = router;

