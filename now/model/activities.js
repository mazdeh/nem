var mongoose = require('mongoose');
var activitySchema = new mongoose.Schema({
	tag: String,
	created: Date,
	expires: Date,
	count: Number,
	isOn: Boolean
});