// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const logger = require('morgan');
const moment = require('moment');
const errorhandler = require('errorhandler');

const app = express();

// CONFIG
// =============================================================================
const config = require('./app/config/config');
const Library = require('./lib');

if (app.get('env') === 'development') {
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
} else {
  app.use(errorhandler());
}

// DATABASE
Library.databases.mongodb(app);

// HEADER
// =============================================================================
app.use((req, res, next) => {
  // set X-Powered By
  res.setHeader('X-Powered-By', config.powered_by);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// middleware LOGGER
// =============================================================================
const logDirectory = path.join(__dirname, 'storage/logs');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
const accessLogStream = rfs(`${moment().format('YYYY-MM-DD')}.log`, {
  interval: '1d', // rotate daily
  path: logDirectory,
});
// setup the logger
app.use(logger(':date[iso] ":method :url :http-version" :status :res[content-length] - :response-time ms - :remote-addr ":req[Host] :remote-user :referrer :req[Content-Length]" :req[Authorization]', { stream: accessLogStream }));


// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use((req, res, next) => {
  // req.headers.user = 'iyong';
  next(); // make sure we go to the next routes and don't stop here
});

const index = require('./app/routes/index');
const users = require('./app/routes/users');

router.use('/', index);
router.use('/users', users);

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = 'Request Not Found';
  next(err);
});

// error handler
router.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    error: true,
    alerts: {
      code: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
    errors: err.errors,
    data: null,
  });

  return next();
});

app.use('/', router);

module.exports = app;
