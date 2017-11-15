const dbConfig = require('../../app/config/database');

const { DatabaseError } = require('custom-errors').general;
// const express = require('express');
const bluebird = require('bluebird');

// const objExpress = express();
// autoReconnect:true,,poolSize:20,reconnectTries: Number.MAX_VALUE,
// reconnectInterval: 500
const mongooseOptions = { useMongoClient: true, promiseLibrary: bluebird };
const debugMongoDB = require('debug')('MongoDB');
// const parent= require('../index');

const mongoose = require('mongoose');
// autoIncrement = require('mongoose-auto-increment');

/* Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON, */

// const mongoose   = require('mongoose');
// mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://localhost:27017/db_nasihatorangtua', {
//   useMongoClient: true
//   /* other options */
// }); // connect to our database
// module.exports = function (parent) {}

module.exports = function (parent) {
  // set mongooseStr
  let userPassword = '';
  if (dbConfig.username !== '') {
    userPassword += dbConfig.username;
    if (dbConfig.password !== '') {
      userPassword += ':';
      userPassword += dbConfig.password;
    }
    userPassword += '@';
  }
  const mongooseStr = `mongodb://${userPassword}${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

  if (typeof parent === 'boolean') {
    // parent = objExpress;
    if (mongoose.connection.readyState === 0) {
      const dbTestA = mongoose.connect(mongooseStr, mongooseOptions, (err) => {
        if (err) {
          throw new DatabaseError(((typeof (err) === 'undefined') ? 'Could Not Connect To Database' : err));
        }

        debugMongoDB('success connect to database 1');
      });
      // autoIncrement.initialize(mongoose.connection);
      dbTestA.on('error', console.error.bind(console, 'connection error:'));
    }

    this.closeConnection = function () {
      if (mongoose.connection.readyState !== 0) {
        mongoose.connection.close();
      }
    };

    this.openConnection = function () {
      if (mongoose.connection.readyState === 0) {
        mongoose.connect(mongooseStr, mongooseOptions, (err) => {
          if (err) {
            throw new Error(err);
            // return next(new DatabaseError(((typeof(err) == 'undefined')? 'Could Not Connect To Database': err)));
          }
        });
      } else {
        console.log('AASF', mongoose.connection.readyState);
      }
    };

    return this;
  }

  parent.use((req, res, next) => {
    if (mongoose.connection.readyState === 0) {
      const dbTest = mongoose.connect(mongooseStr, mongooseOptions, (err) => {
        if (err) {
          mongoose.connection.close();
          debugMongoDB(mongooseStr);
          return next(new DatabaseError(((typeof (err) === 'undefined') ? 'Could Not Connect To Database' : err)));
        }
        // return next();
        next();
      });

      dbTest.on('error', console.error.bind(console, 'connection error:'));
      //  console.log(new Date() - start);
      // autoIncrement.initialize(mongoose.connection);
      // return next();
    } else {
      next();
    }
  });
};
