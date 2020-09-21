const userSchema = require('../schemas/userSchema');
const flagCache = 0;
const blockCache = {};
let flags = 0;
let block = false;
// checks if the user exists in the data base
module.exports.checkUser = async (id, username) => {
	const result = await userSchema.findOne({
		id: id,
		username: username,
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
				description: '',
				descPer: '',
				raidInfo: '',
				raid: '',
			}).save();
		console.log('adding new id: ' + id + ' to database');
		return result;
	}


};
// checks if the user is blocked
module.exports.blockCheck = async (id) => {
	const cachedBlock = blockCache[`${id}`];
	if (cachedBlock) {
		return cachedBlock;
	}

	const checkBlock = await userSchema.findOne({
		id,
	});
	block = checkBlock.block;
	blockCache[`${id}`] = block;
	return block;

};
// blocks the user
module.exports.blockUser = async (id) => {
	const cachedBlock = blockCache[`${id}`];
	if (cachedBlock) {
		return cachedBlock;
	}
	const result = await userSchema.findOneAndUpdate({
		id,
	},
	{
		block: true,
	},
	{
		upsert: true,
		new: true,
	});
	block = result.block;
	blockCache[`${id}`] = block;
	console.log(`user ${id} was blocked`);
	return block;

};
// flags user for using commands he does not have access to
module.exports.flagUser = async (id) => {
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
	});
	flags = addFlag.flags;
	flagCache[`${id}`] = flags;
	console.log(`user ${id} was flagged`);
	return flags;

};
// checks if the user has any flags
module.exports.flagCheck = async (id) => {
	const cachedFlag = flagCache[`${id}`];
	if (cachedFlag) {
		return cachedFlag;
	}
	const checkFlag = await userSchema.find({
		id: id,
	});
	flagCache[`${id}`] = checkFlag.flags;
	// console.log(checkFlag);
	return checkFlag.flags;

};
// This is the script that flags and blocks users automatically
module.exports.autoModeration = async (id, username, message) => {
	const user = await this.checkUser(id, username);
	const blockCheck = user.block;
	const flagCheck = user.flags;
	let blockChecked = blockCheck;
	let flagsI = flagCheck;
	if(blockChecked === true) {
		const flagging = await this.flagUser(id);
		flagsI = flagging;
		message.client.users.cache.get(message.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
		// return message.channel.send('<@' + message.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
	}
	else if (flagsI === 0) {
		const flagging = await this.flagUser(id);
		flagsI = flagging;
		return message.reply('*you have be flagged **' + flagging + '** times, at 10 you get blocked!*:angry:');
	}
	else if(flagsI > 0 && flagsI <= 9) {
		const flagging = await this.flagUser(id);
		flagsI = flagging;
		return message.reply('*you have be flagged **' + flagging + '** times, at 10 you get blocked!*:angry:');
	}
	else if(flagsI >= 10) {
		const blockI = await this.blockUser(id);
		const flagging = await this.flagUser(id);
		flagsI = flagging;
		blockChecked = blockI;
		console.log(id + ' block = ' + blockI);
		return message.reply('**you have been blocked from using me!** :angry:');
	}
};