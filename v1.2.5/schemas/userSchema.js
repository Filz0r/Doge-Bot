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
const userSchema = mongoose.Schema({
	id: reqString,
	username: reqString,
	host: reqBoolean,
	block: reqBoolean,
	flags: Num,
	list: {
		mon: string,
		quant: Num,
		status: reqBoolean,
	},
	description: {
		ign: string,
		code1: Num,
		code2: Num,
		dd: string,
		ping: string,
	},
	descPer: string,
	raidInfo: {
		ign: string,
		name: string,
		fc: string,
	},
	raid: {
		mode: string,
		denNum: string,
		rotation: string,
		game: string,
		code1: string,
		code2: string,
		timer: string,
		shiny: string,
		stars: string,
		fixMon: string,
	},
});
module.exports = mongoose.model('user', userSchema);