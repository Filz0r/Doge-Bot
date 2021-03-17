const userSchema = require('../schemas/userSchema');
// db layouts used when updating  the db
module.exports.saveListToDB = async (id, data) => {
	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		list: data,
	},
	{
		upsert: true,
		new: true,
	});
	return result.list;

};
module.exports.saveInfoToDb = async (id, data) => {
	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		description: data,
	},
	{
		upsert: true,
		new: true,
	});
	return result.description;
};
module.exports.saveDescToDb = async (id, data) => {
	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		descPer: data,
	},
	{
		upsert: true,
		new: true,
	});
	return result;
};
module.exports.saveRaidInfo = async (id, data) => {
	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		raidInfo: data,
	},
	{
		upsert: true,
		new: true,
	});
	return result;
};
module.exports.saveRaid = async (id, data) => {

	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		raid: data,
	},
	{
		upsert: true,
		new: true,
	});
	return result;

};