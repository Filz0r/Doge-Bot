const Command = require('../../Structures/Command');
const check = require('../../Structures/user.js');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ut'],
			category: 'Information',
			description: 'This provides the current uptime of the bot.',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const USER = await check.checkUser(id, tag);
		if(!USER.block) {
			message.channel.send(`My uptime is \`${ms(this.client.uptime, { long: true })}\``);
		}
		else if(USER.block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}

};
