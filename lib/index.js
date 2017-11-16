exports.databases = {};
exports.sessions = {};

exports.databases.mongodb = require('./databases/mongo_database_lib');
exports.sessions.auth = require('./sessions/authenticate');
