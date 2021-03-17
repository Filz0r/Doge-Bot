const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
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
			name: 'block',
			description: 'Blocks and unblocks users from using the bot! But be carefull I have eyes everywhere!',
			category: 'Admin',
			usage: '<mention user to block>',
		});
	}
	async run(message) {
		const { id, tag } = message.author;
		if(this.client.owners.includes(id) || message.member.hasPermission(permissions)) {
            return await USERS.banSwitch(message);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 2);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};