const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const AUTOMOD = require('../../controller/automod');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ut'],
			category: 'Bot Related/Information',
			description: 'This provides the current uptime of the bot.',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const { block }= await USERS.checkUser(id, tag);
		if(!block) {
    		return message.channel.send(`My uptime is \`${ms(this.client.uptime, { long: true })}\``);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}

};