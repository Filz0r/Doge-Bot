const mongo = require('./mongo');
const userSchema = require('../schemas/userSchema');
const flagCache = 0;
const blockCache = {};
let flags = 0;
let block = false;
// checks if the user exists in the data base
module.exports.checkUser = async (id, username) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await userSchema.findOneAndUpdate({
				id,
				username,
			},
			{
				upsert: true,
				useFindAndModify: false,
			});
			if (result !== null) {
				return result;
			}
			else if (result === null) {
				await new userSchema(
					{
						id: id,
						username: username,
						host: false,
						block: false,
						flags: 0,
						list: '',
						description: {},
						descPer: '',
						raidInfo: {},
					}).save();
				console.log('adding new id: ' + id + ' to database');
				return result;
			}
		}
		finally {
			mongoose.connection.close();
		}
	});
};
// checks if the user is blocked
module.exports.blockCheck = async (id) => {
	const cachedBlock = blockCache[`${id}`];
	if (cachedBlock) {
		return cachedBlock;
	}
	return await mongo().then(async (mongoose) => {
		try{
			const checkBlock = await userSchema.findOne({
				id,
			});
			block = checkBlock.block;
			blockCache[`${id}`] = block;
			return block;
		}
		finally{
			mongoose.connection.close();
		}
	});
};
// blocks the user
module.exports.blockUser = async (id) => {
	const cachedBlock = blockCache[`${id}`];
	if (cachedBlock) {
		return cachedBlock;
	}
	return await mongo().then(async (mongoose) => {
		try{
			const result = await userSchema.findOneAndUpdate({
				id,
			},
			{
				block: true,
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			block = result.block;
			console.log(id + ' is blocked ' + block);
			blockCache[`${id}`] = block;
			return block;
		}
		finally{
			mongoose.connection.close();
		}
	});
};
// flags user for using commands he does not have access to
module.exports.flagUser = async (id) => {
	return await mongo().then(async (mongoose) => {
		try{
			console.log('adding a flag');
			const addFlag = await userSchema.findOneAndUpdate({
				id,
			},
			{
				$inc: {
					flags: 1,
				},
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
			flags = addFlag.flags;
			flagCache[`${id}`] = flags;
			return flags;
		}
		finally {
			mongoose.connection.close();
		}
	});
};
// checks if the user has any flags
module.exports.flagCheck = async (id) => {
	const cachedFlag = flagCache[`${id}`];
	if (cachedFlag) {
		return cachedFlag;
	}
	return await mongo().then(async (mongoose) => {
		try{
			const checkFlag = await userSchema.findOne({
				id,
			});
			flagCache[`${id}`] = checkFlag.flags;
			return checkFlag.flags;
		}
		finally{
			mongoose.connection.close();
		}
	});
};