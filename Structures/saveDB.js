const mongo = require('./mongo');
const userSchema = require('../schemas/userSchema');
// layout db layout used when updating the list object to the db
module.exports.saveListToDB = async (id, data) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await userSchema.findOneAndUpdate({
				id: id,
			},
			{
				list: data,
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			return result.list;
		}
		finally {
			mongoose.connection.close();
		}
	});
};

module.exports.saveInfoToDb = async (id, data) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await userSchema.findOneAndUpdate({
				id: id,
			},
			{
				description: data,
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			return result.description;
		}
		finally {
			mongoose.connection.close();
		}
	});
};

module.exports.saveDescToDb = async (id, data) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await userSchema.findOneAndUpdate({
				id: id,
			},
			{
				descPer: data,
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			return result;
		}
		finally {
			mongoose.connection.close();
		}
	});
};
module.exports.saveRaidInfo = async (id, data) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await userSchema.findOneAndUpdate({
				id: id,
			},
			{
				raidInfo: data,
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			return result;
		}
		finally {
			mongoose.connection.close();
		}
	});
};