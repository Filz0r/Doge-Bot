const Command = require('../../controller/commands.js');
const GUILD = require('../../controller/guilds');
const AUTOMOD = require('../../controller/automod')
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
	'BAN_MEMBERS',
	'KICK_MEMBERS',
	'MANAGE_CHANNELS',
]);
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'logs',
			description: 'Set the channel where this command is sent as the log output for automoderation functionalities',
			category: 'Admin',
			usage: 'type the command on the desired output channel'
		});
	}
	async run(message) {
		const { id, tag } = message.author;
		const { id: guildID } = message.guild;
		const logChannel =  message.channel.id;
		if (message.member.hasPermission(permissions)) {
			return await GUILD.setLogChannel(guildID, logChannel, message);
		}
		else {
			const guild = await GUILD.checkGuild(message);
			if (guild.admins.includes(id) || id === this.client.owners[0]) return;
			const reason = await AUTOMOD.autoModeration(id, tag, message, 7);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};