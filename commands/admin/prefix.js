const Command = require('../../controller/commands.js');
const GUILD = require('../../controller/guilds');
const AUTOMOD = require('../../controller/automod');
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
			name: 'prefix',
			description: 'changes the prefix of the bot in the guild where its used',
			category: 'Admin',
			usage: '<prefix>',
			args: true,
		});
	}
	async run(message, args) {
		const { id, tag } = message.author;
		const { id: guildID } = message.guild;
		if (message.member.hasPermission(permissions)) {
			const prefix = args[0];
			const change = await GUILD.changePrefix(prefix, guildID, message);
			if (change) return;
		}
		else {
			const guild =await GUILD.checkGuild(message);
			if (guild.admins.includes(id) || id === this.client.owners[0]) return;
			const reason = await AUTOMOD.autoModeration(id, tag, message, 3);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};