const Command = require('../../Structures/Command.js');
const guilds = require('../../Structures/guilds');
const user = require('../../Structures/user');
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
		if (message.member.hasPermission(permissions)) {
			const { id: guildID } = message.guild;
			const prefix = args[0];
			const change = await guilds.changePrefix(prefix, guildID, message);
			if (change) return;
		}
		else {
			await user.autoModeration(id, tag, message, 3);
		}
	}
};