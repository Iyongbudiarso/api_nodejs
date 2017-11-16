// app/models/users.js

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcrypt');
const config = require('../../app/config/config');

const { Schema } = mongoose;

const SALT_WORK_FACTOR = config.salt_work_factor;
// MAX_LOGIN_ATTEMPTS = 5,
// LOCK_TIME = 2 * 60 * 60 * 1000; // 2hours

const UsersSchema = new Schema({
  full_name: { type: String, required: true },

  email: { type: String, required: true },
  password: { type: String, select: false }, // https://stackoverflow.com/a/12096922/1811296

  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  activation_code: { type: String, default: '' },
  last_login: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  role: { type: Array, default: ['user'] },
}, {
  strict: false,
});

UsersSchema.pre('save', function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err2, hash) => {
      if (err2) return next(err2);
      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

module.exports = mongoose.model('Users', UsersSchema);
