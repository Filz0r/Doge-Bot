const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const string = {
	type: String,
	required: false,
};
const raidSchema = mongoose.Schema({
	_id: reqString,
	ign: string,
	name: string,
	fc: string,
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
});
module.exports = mongoose.model('raids', raidSchema);