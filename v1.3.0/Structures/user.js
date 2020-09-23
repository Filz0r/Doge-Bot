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

// This is the script that flags and blocks users automatically
module.exports.autoModeration = async (id, tag, message, reason) => {
	const reasons = {
		0: 	'trying to use non existing commands',
		1:	'trying to add users has hosts',
		2:	'trying to block users from using me',
		3:	'trying to change my prefix for this server',
		4:  'trying to use the giveaway command',
		5:	'trying to use the raid command',
		6:	'trying to change the dens information',
		7: 	'trying to kill me',
		8:	'trying to use the nextrade command',
		9:	'trying to use the bot after being blocked',
		10: 'using owner only commands',

	};
	// eslint-disable-next-line prefer-const
	let { block, flags, ignoreFlags } = await this.checkUser(id, tag);
	const { name } = message.guild;
	if(flags < 0) return console.log(`ERROR: user ${ tag } has invalid flags: ${ flags }`);
	if(flags > 10) return console.log(`ERROR: user ${ tag } has invalid flags ${ flags }`);
	if(ignoreFlags < 0) return console.log(`ERROR: user ${ tag } has invalid flags: ${ flags }`);
	if(ignoreFlags > 10) return console.log(`ERROR: user ${ tag } has invalid flags ${ flags }`);
	if(flags >= 0 && flags <= 9 && !block) {
		flags++;
		await userSchema.findOneAndUpdate({ _id: id }, { flags });
		if (flags === 10) {
			await userSchema.findOneAndUpdate({ _id: id }, { block: true });
			console.log(`user ${ tag } was blocked for having to many flags!`);
			return message.reply('you are now blocked from using me!');
		}
		else {
			console.log(`${ tag } was flagged for ${ reasons[reason] } on ${ name }, total flags : ${ flags }`);
			message.client.users.cache.get(id).send(`You were flaged for: \`${ reasons[reason] }\`\n\`Current flags: ${ flags }/10\``);
			return reasons[reason];
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

module.exports.tellMod = async (message, id, reason) => {
	const activeAdmin = message.guild.members.cache.filter(member => member.permissions.has('BAN_MEMBERS') && member.presence.status !== 'offline' && member.user.bot === false)
		.map(member => member.user.id);
	const noAdmin = activeAdmin.length === 0;
	if (noAdmin) {
		message.channel.send(`<@${ message.guild.ownerID }> the user <@${ id }> was flagged for \`${ reason }\`\nThere were no mods online he did this so I am reporting to you`);
	}
	else {
		const i = Math.floor(Math.random() * activeAdmin.length);
		message.channel.send(`<@${activeAdmin[i]}> the user <@${ id }> was flagged for \`${ reason }\``);
	}
};