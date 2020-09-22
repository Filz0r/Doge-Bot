const mongoose = require('mongoose');
const string = {
	type: String,
	required: false,
};
const denSchema = mongoose.Schema({
	_id: string,
	shield: {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
	},
	sword: {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
	},
});
module.exports = mongoose.model('dens', denSchema);