const Command = require('../../Structures/Command');
const check = require('../../Structures/user');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['latency', 'pingcheck'],
			description: 'This provides the ping of the bot',
			category: 'Information',
		});
	}

	async run(message) {
		const { id } = message.author;
		const { username } = message.author;
		await check.checkUser(id, username);
		const blockCheck = await check.blockCheck(id);
		let flag = 0;
		if(blockCheck === false) {

			const msg = await message.channel.send('Pinging...');
			const latency = msg.createdTimestamp - message.createdTimestamp;
			const choices = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!'];
			const response = choices[Math.floor(Math.random() * choices.length)];

			msg.edit(`${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);
		}
		if(blockCheck === true) {
			message.reply('you are blocked from using me!');
			flag++;
			flag > 3 ? message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>')
			&& message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>') : '';
		}
	}
};