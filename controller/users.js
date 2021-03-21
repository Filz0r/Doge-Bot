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
// controler that blocks/unblocks users
// for now it only works with the block command
// in the future I want to make the automod controller to also use this function.
module.exports.banSwitch = async (message) => {
	const { mentions, guild, author } = message;
	const { tag } = author;
	const { id: targetID, tag: tTAG } = mentions.users.first();
	const { block, flags, ignoreFlags } = await this.checkUser(targetID, tTAG)
	if (block) {
		console.log(`${tag} unblocked ${tTAG}, on ${guild.name}, he had ${flags} block flags and has ${ignoreFlags} ignore flags`)
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
// just like the banSwitch function handles, except it uses the ignore flags instead.
// in the future automod will also make use of this function.
module.exports.ignoreSwitch = async (message) => {
	const { mentions } = message;
	const { id: targetID, tag: tTAG } = mentions.users.first();
	const { ignore, block, flags, ignoreFlags } = await this.checkUser(targetID, tTAG)
	if (ignore) {
		console.log(`You made me stop to ignore ${tTAG} he has ${flags} block flags, ${ignoreFlags} ignore flags and his block status is ${block}`)
		await userSchema.findOneAndUpdate({
			_id: targetID
		}, {
			ignore: false
		}).exec();
		return message.channel.send(`<@!${targetID}> I will stop ignoring you now, but \`NOW BE CAREFULL OR\`:knife:`)
	} else {
		await userSchema.findOneAndUpdate({
			_id: targetID
		}, {
			ignore: true
		}).exec();
		console.log(`${targetID} is now being ignored by me!`);
		return message.channel.send(`<@!${targetID}> well to put it simply I will now ignore everything you say to me!`);
	}

}

// function to add an user as a pokemon host
module.exports.hostSwitch = async (message, id) => {
	const { guild } = message;
	await userSchema.findOneAndUpdate({ _id: id }, { host: true }).exec();
	console.log(`${id} was added as an host on ${guild.name}`);
	return message.reply(` I added you as an Pokemon host!`);
}



