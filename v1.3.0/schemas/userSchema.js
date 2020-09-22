const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const Num = {
	type: Number,
	required: false,
};
const reqBoolean = {
	type: Boolean,
	required: false,
};
const userSchema = mongoose.Schema({
	_id: reqString,
	tag: reqString,
	host: reqBoolean,
	block: reqBoolean,
	ignore: reqBoolean,
	flags: Num,
	ignoreFlags: Num,
});
module.exports = mongoose.model('user', userSchema);