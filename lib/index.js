exports.databases = {};
exports.sessions = {};
exports.utils = {};

exports.databases.mongodb = require('./databases/mongo_database_lib');
exports.sessions.auth = require('./sessions/authenticate');
exports.utils.fileType = require('./utils/file_type');
