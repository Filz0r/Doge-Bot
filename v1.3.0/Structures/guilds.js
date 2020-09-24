const guildSchema = require('../schemas/guildSchema');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
	'BAN_MEMBERS',
	'KICK_MEMBERS',
	'MANAGE_CHANNELS',
]);

module.exports.checkGuild = async (message) => {
	const { id: guildID, name, ownerID } = message.guild;
	const admins = !message.guild.members.cache ? [ ownerID ] : message.guild.members.cache.filter(member => member.permissions.has(permissions) && !member.user.bot)
		.map(member => member.user.id);
	const prefix = message.client.prefix;
	let result = await guildSchema.findOne({ _id: guildID });


	if (result === null) {
		result = await new guildSchema({
			_id: guildID,
			guildName: name,
			ownerID,
			admins,
			prefix,
		}).save();
		console.log(`I was added to ${ name }!`);
		return result;
	}
	if (result !== null) {
		result = await guildSchema.findOneAndUpdate({
			_id: guildID,
		},
		{
			guildName: name,
			ownerID,
			admins,
		});
		return result;
	}
	return result;
};

module.exports.changePrefix = async (prefix, guildID, message) => {
	let result = await guildSchema.findOne({ _id: guildID });
	result === null ? this.checkGuild(message) : result = await guildSchema.findOneAndUpdate({ _id: guildID }, { prefix: prefix });
	message.reply(`the prefix for this server has been changed to \`${ prefix }\``);
	return true;
};