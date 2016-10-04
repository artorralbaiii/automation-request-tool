"use strict";

// Custom Packages
var configuration = require('./configuration');

// Vendor Packages
var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

// create a new express server
var app = express();

// Database Connection
mongoose.connect(configuration.mongodbUri, function(err){
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to database...'); 			
	}
});

// Parse incoming request as JSON.
app.use(bodyParser.urlencoded({extended: false, keepExtensions: true}));
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(session({ 
	secret: configuration.secretKey, 
	cookie: { maxAge: 60*60*1000 }, 
	saveUninitialized : true, 
	resave : true
}));

// API Router
var api = require('./app/routes/api.js')(app, express);
app.use('/api', api);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
