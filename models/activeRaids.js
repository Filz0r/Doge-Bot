const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};
const string = {
	type: String,
	required: false,
};
const activeRaids = mongoose.Schema({
	_id: reqString,
    active: {
        type: Object,
        required: false,
    },
	
});
module.exports = mongoose.model('activeRaids', activeRaids);