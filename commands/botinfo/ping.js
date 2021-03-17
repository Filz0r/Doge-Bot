const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const AUTOMOD = require('../../controller/automod')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['latency', 'pingcheck', 'p'],
			description: 'This provides the ping of the bot',
			category: 'Information',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const { block } = await USERS.checkUser(id, tag);
		if (!block) {
			const msg = await message.channel.send('Pinging...');
			const latency = msg.createdTimestamp - message.createdTimestamp;
			const choices = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!'];
			const response = choices[Math.floor(Math.random() * choices.length)];

			msg.edit(`${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 9);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};