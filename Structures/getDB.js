const mongo = require('./mongo');
const userSchema = require('../schemas/userSchema');
// gets the list from the db
module.exports.getList = async (id) => {
	return await mongo().then(async (mongoose) => {
		let list = '';
		try {
			const checkList = await userSchema.findOne({
				id: id,
			},
			{
				list: list,
			});
			list = checkList.list;
			return list;
		}
		finally {
			mongoose.connection.close();
		}
	});
};
// grabs the info inside of the db
module.exports.getInfo = async (id) => {
	let info = '';
	return await mongo().then(async (mongoose) => {
		try {
			const checkDesc = await userSchema.findOne({
				id: id,
			},
			{
				description: info,
			});
			info = checkDesc.description;
			return info;
		}
		finally {
			mongoose.connection.close();
		}
	});
};
module.exports.getDesc = async (id) => {
	let desc = '';
	return await mongo().then(async (mongoose) => {
		try {
			const checkDesc = await userSchema.findOne({
				id: id,
			},
			{
				descPer: desc,
			});
			desc = checkDesc.descPer;
			return desc;
		}
		finally {
			mongoose.connection.close();
		}
	});
};