const Command = require('../../Structures/Command.js');
const guilds = require('../../Structures/guilds');
const USER = require('../../Structures/user');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
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
	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const { id, tag } = message.author;
		const { id: guildID } = message.guild;
		if (message.member.hasPermission(permissions)) {
			const prefix = args[0];
			const change = await guilds.changePrefix(prefix, guildID, message);
			if (change) return;
		}
		else {
			const guild = guilds.checkGuild(message);
			if (guild.admins.includes(id) || id === this.client.owners[0]) return;
			const reason = await USER.autoModeration(id, tag, message, 3);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};