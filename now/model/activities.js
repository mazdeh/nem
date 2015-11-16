var mongoose = require('mongoose');
var activitySchema = new mongoose.Schema({
	tag: String,
	created: Date,
	count: Number,
	isOn: Boolean
});
mongoose.model('Activity', activitySchema);