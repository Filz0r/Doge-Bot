const userSchema = require('../models/users');
// checks if the user exists in the data base
module.exports.checkUser = async (id, tag) => {
	const result = await userSchema.findOne({
		_id: id
	});
	if (result !== null && tag !== result.tag) {
		await userSchema.findOneAndUpdate({ _id: id }, { tag: tag })
		console.log(`the user ${id} has updated his name to: ${tag}`)
		return result;
	}
	else if (result !== null) {
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
		console.log(`added user id: ${id} to database`);
		return result;
	}
};

module.exports.banSwitch = async (message) => {
	const { mentions, guild, author } = message;
	const { tag } = author;
	const { id: targetID, tag: tTAG } = mentions.users.first();
	const { block, flags, ignoreFlags } = await this.checkUser(targetID, tTAG)
	if (block) {
		console.log(`${tag} unblocked ${tTAG}, on ${guild.name}, whe had ${flags} block flags and has ${ignoreFlags} ignore flags`)
		await userSchema.findOneAndUpdate({
			_id: targetID
		}, {
			block: false,
			flags: 0
		}).exec();
		return message.channel.send(`<@!${targetID}> was unblocked from using me, and now has 0 block flags again!\n\`NOW BE CAREFULL OR\`:knife:`)
	} else {
		await userSchema.findOneAndUpdate({
			_id: targetID
		}, {
			block: true
		}).exec();
		console.log(`${targetID} was blocked from using me by ${tag} on ${guild.name}`);
		return message.channel.send(`<@!${targetID}> was blocked from using me!`);
	}

}

module.exports.hostSwitch = async (message, id) => {
	const { guild } = message;
	await userSchema.findOneAndUpdate({ _id: id }, { host: true }).exec();
	console.log(`${ id } was added as an host on ${ guild.name }`);
	return message.reply(` I added you as an Pokemon host!`);
}



