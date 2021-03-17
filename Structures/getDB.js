const userSchema = require('../schemas/userSchema');
const denSchema = require('../schemas/denSchema');
// gets the list from the db
module.exports.getList = async (id) => {
	let list = '';

	const checkList = await userSchema.findOne({
		id: id,
	},
	{
		list: list,
	});

	list = checkList.list;
	return list;
};
// grabs the info inside of the db
module.exports.getInfo = async (id) => {
	let info = '';

	const checkDesc = await userSchema.findOne({
		id: id,
	},
	{
		description: info,
	});

	info = checkDesc.description;
	return info;
};
module.exports.getDesc = async (id) => {
	let desc = '';
	const checkDesc = await userSchema.findOne({
		id: id,
	},
	{
		descPer: desc,
	});
	desc = checkDesc.descPer;
	return desc;
};
module.exports.getRaidInfo = async (id) => {
	let desc = '';

	const checkDesc = await userSchema.findOne({
		id: id,
	},
	{
		raidInfo: desc,
	});

	desc = checkDesc.raidInfo;
	return desc;
};
module.exports.getRaid = async (id) => {
	let desc = '';
	const checkDesc = await userSchema.findOne({
		id: id,
	},
	{
		raid: desc,
	});

	desc = checkDesc.raid;
	return desc;
};
module.exports.getRaidList = async (game, denNum) => {
	let list = '';

	const checkList = await denSchema.findById({
		_id: denNum,
		// UPDATE: [game]: game goes here and the rest is delete
	},
	{
		[game]: game,
	});

	list = checkList;
	return list;
};