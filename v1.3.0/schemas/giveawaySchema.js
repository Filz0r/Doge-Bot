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
const string = {
	type: String,
	required: false,
};
const giveawaySchema = mongoose.Schema({
	_id: reqString,
	ign: string,
	code1: string,
	code2: string,
	dd: string,
	ping: string,
	desc: string,
	list: {
		mon: string,
		quant: Num,
		status: reqBoolean,
	},
});
module.exports = mongoose.model('giveaways', giveawaySchema);