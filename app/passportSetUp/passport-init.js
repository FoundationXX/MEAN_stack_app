var mongoose = require('mongoose');   
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var localstrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user._id);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
								console.log('deserializing user:',user.username);
								if(err){
									return done(err,false);
								}
								if(!user){
									return done('user not found', false);
								}
			
			
								return done(user, true);
					});
	});

	passport.use('signup', new localstrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			// find a user in mongo with provided username
			User.findOne({ 'username' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+ err);
					return done(err, false);
				}
				// already exists
				if (user) {
					console.log('User already exists with username: '+username);
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.username = username;
					newUser.password = createHash(password);

					// save the user
					newUser.save(function(err, newUser) {
						if (err){
							console.log('Error in Saving user: '+err);							
							throw err;  
						}
						console.log(newUser.username + ' Registration succesful');    
						return done(null, newUser, {message:'Thanks for joining!'});
					});
				}
			});
		})
	);
	
	passport.use('login', new localstrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// check in mongo if a user with username exists or not
			User.findOne({ 'username' :  username }, function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err, false);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with username '+username);
						return done('This username does not exist', false);                 
					}
					// User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done('Incorrect Password', false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					return done(null, user);
				}
			);
		}
	));
	
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};