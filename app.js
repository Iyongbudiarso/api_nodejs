// BASE SETUP
// =============================================================================

// express
var express = require('express'),
    app = express();

// call the packages we need
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream');
var bodyParser = require('body-parser');
var logger = require('morgan');
var moment = require('moment');

var mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/db_nasihatorangtua', {
  useMongoClient: true
  /* other options */
}); // connect to our database

// middleware LOGGER
// =============================================================================
var logDirectory = path.join(__dirname, 'storage/logs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs(moment().format('YYYY-MM-DD')+'.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})
// setup the logger
app.use(logger(':date[iso] ":method :url :http-version" :status :res[content-length] - :response-time ms - :remote-addr ":req[Host] :remote-user :referrer :req[Content-Length]"', {stream: accessLogStream}))
// =============================================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(req.headers);
    // req.headers.user = 'iyong';
    // console.log(req.headers.token);
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


var routePath="./app/routes/"; //add one folder then put your route files there my router folder name is routers
fs.readdirSync(routePath).forEach(function(file) {
    var route=routePath+file;
    var filename = file.match(/([^\/]+)(?=\.\w+$)/)[0];
    router.use('/'+(filename != 'index' ? filename : ''), require(route));
});

// var index = require('./routes/index');
// var users = require('./routes/users');
// router.use('/', index);
// router.use('/users', users);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.message = 'Request Not Found';
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        'error': true,
        'alerts': {
            'code': err.status || 500,
            'message': err.message || 'Internal Server Error'
        },
        'data': null
    });
});

app.use('/', router);
// app.use('/api', router);

module.exports = app;
