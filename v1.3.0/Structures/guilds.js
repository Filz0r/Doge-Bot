const guildSchema = require('../schemas/guildSchema');

module.exports.checkGuild = async (message) => {
	const { id: guildID, name, ownerID } = message.guild;
	const admins = !message.guild.members.cache ? [ ownerID ] : message.guild.members.cache.filter(member => member.permissions.has('ADMINISTRATOR') && member.user.bot === false)
		.map(member => member.user.id);
	const prefix = message.client.prefix;
	const result = await guildSchema.findOne({ _id: guildID });


	if (result === null) {
		const nGuild = await new guildSchema({
			_id: guildID,
			guildName: name,
			ownerID,
			admins,
			prefix,
		}).save();
		console.log(`I was added to ${ name }!`);
		return nGuild;
	}
	return result;
};

module.exports.changePrefix = async (prefix, guildID, message) => {
	let result = await guildSchema.findOne({ _id: guildID });
	result === null ? this.checkGuild(message) : result = await guildSchema.findOneAndUpdate({ _id: guildID }, { prefix: prefix });
	message.reply(`the prefix for this server has been changed to \`${ prefix }\``);
	return true;
};