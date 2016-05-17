
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	text: String,
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now}
});

var userSchema = new Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
})

//declare schemas
mongoose.model('Post', postSchema);
mongoose.model('User', userSchema)