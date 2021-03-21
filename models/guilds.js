const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
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
	logOut: string,
});
module.exports = mongoose.model('guilds', guildSchema);