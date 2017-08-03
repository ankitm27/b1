var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var redis = require("redis");
    

//call modules 
var index = require('./app/routes/index');
var users = require('./app/routes/users');
var bots = require('./app/routes/bots');
var messages = require('./app/routes/messages');

var app = express();

//redis connection
client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

client.on("connect", function () {
    console.log("redis connect");
});

// client.set("abc","abc");



//mongo connection
var connection = mongoose.connect("mongodb://localhost/fugu_bot");
mongoose.connection.once("connected",function(err){
  console.log("mongo database connected");
});


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//routes calling
app.use('/', index);
app.use('/users', users);
app.use('/bots',bots);
app.use('/messages',messages);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// module.exports = app;
exports.app = app;
exports.client = client;
exports.ankit = "ankit";