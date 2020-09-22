const userSchema = require('../schemas/userSchema');
// checks if the user exists in the data base
module.exports.checkUser = async (id, tag) => {
	const result = await userSchema.findOne({
		_id: id,
		tag: tag,
	});
	if (result !== null) {
		return result;
	}
	else if (result === null) {
		await new userSchema(
			{
				_id: id,
				tag: tag,
				host: false,
				block: false,
				ignore: false,
				flags: 0,
				ignoreFlags: 0,
			}).save();
		console.log(`added user id: ${ id } to database`);
		return result;
	}
};

// blocks the user
module.exports.blockUser = async (id) => {
	const result = await userSchema.findOneAndUpdate({ _id: id }, {	block: true });
	const block = result.block;
	console.log(`user id ${ id } was blocked`);
	return block;
};

// flags user for using commands he does not have access to
module.exports.flagUser = async (id) => {
	const addFlag = await userSchema.findOneAndUpdate({	_id: id }, { $inc: { flags: 1 } });
	const flags = addFlag.flags;
	console.log(`user ${ id } was flagged`);
	return flags;
};

// This is the script that flags and blocks users automatically
module.exports.autoModeration = async (id, tag, message) => {
	// eslint-disable-next-line prefer-const
	let { block, flags, ignoreFlags } = await this.checkUser(id, tag);
	if(flags < 0) return console.log(`ERROR: user ${ tag } has invalid flags: ${ flags }`);
	if(flags > 10) return console.log(`ERROR: user ${ tag } has invalid flags ${ flags }`);
	if(ignoreFlags < 0) return console.log(`ERROR: user ${ tag } has invalid flags: ${ flags }`);
	if(ignoreFlags > 10) return console.log(`ERROR: user ${ tag } has invalid flags ${ flags }`);
	if(flags >= 0 && flags <= 9 && !block) {
		flags++;
		await userSchema.findOneAndUpdate({ _id: id }, { flags: flags });
		if (flags === 10) {
			await userSchema.findOneAndUpdate({ _id: id }, { block: true });
			console.log(`user ${ tag } was blocked!`);
			return message.reply(' you are now blocked from using me!');
		}
		else {
			console.log(`user ${ tag } was flagged ${ flags } times!`);
			return message.reply(`You are not allowed to use/do this!\n\`Current flags: ${flags}/10\``);
		}
	}
	else if(block) {
		ignoreFlags++;
		await userSchema.findOneAndUpdate({ _id: id }, { ignoreFlags: ignoreFlags });
		if (ignoreFlags >= 10) {
			await userSchema.findOneAndUpdate({ _id: id }, { ignore: true });
			console.log(`user ${ tag } is now going to be ignored!`);
			return message.reply('congratulations, from now on I will completely ignore your commands!');
		}
		else {
			console.log(`${ tag }, is working his way up to me ignoring him ${ ignoreFlags }`);
			return message.reply(`I already blocked you, if you keep trying I'll start ignoring you!\n\`Flags:${ ignoreFlags }/10\``);
		}
	}
};