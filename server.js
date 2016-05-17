// server.js

// modules =================================================
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var express        = require('express');
var mongoose       = require('mongoose');
var passport       = require('passport');
var session        = require('express-session');
var logger 		   = require('morgan');
var app            = express();

// configuration ===========================================
// config db path
var db 			   = require('./config/db');
mongoose.connect(db.url);
require('./app/models/users');
//require('./models/albums.js');

app.use(logger('dev'));
// set our port
var port = process.env.PORT || 8080; 


/*
 *Note to self, 'use' to apply middlewares and routes
 */
 
app.use(session({
	secret:'my secret'
}));
app.use(passport.initialize());
app.use(passport.session());

//Initialize passport
var initPassport = require('./app/passportSetUp/passport-init');
initPassport(passport);
// routes ==================================================
var api			   = require('./app/routes/api');
app.use('/api', api);
var authenticate   = require('./app/routes/authenticate')(passport);
app.use('/auth', authenticate);


// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('node server started on port ' + port);
console.log('mongoose server connection ' + db.url);

// expose app           
exports = module.exports = app;   
