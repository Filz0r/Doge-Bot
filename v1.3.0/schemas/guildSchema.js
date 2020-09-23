const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const reqBoolean = {
	type: Boolean,
	required: false,
};
const string = {
	type: String,
	required: false,
};
const guildSchema = mongoose.Schema({
	_id: reqString,
	guildName: reqString,
	ownerID: reqString,
	admins: [],
	prefix: string,
});
module.exports = mongoose.model('guilds', guildSchema);