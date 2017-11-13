// app/models/users.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt');

var SALT_WORK_FACTOR = 10,
MAX_LOGIN_ATTEMPTS = 5,
LOCK_TIME = 2 * 60 * 60 * 1000; // 2hours

var UsersSchema   = new Schema({
    full_name : {type:String, required:true},

    email : {type:String,required: true},
    password : {type: String},
    
    last_login : {type:Date},
    created_at : {type:Date, 'default':Date.now},
    updated_at : {type:Date},
});

module.exports = mongoose.model('Users', UsersSchema);