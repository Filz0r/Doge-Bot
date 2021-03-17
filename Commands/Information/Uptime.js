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
		const { id } = message.author;
		const { username } = message.author;
		await check.checkUser(id, username);
		const blockCheck = await check.blockCheck(id);
		let flag = 0;
		if(blockCheck === false) {
			message.channel.send(`My uptime is \`${ms(this.client.uptime, { long: true })}\``);
		}
		else if(blockCheck === true) {
			message.reply('you are blocked from using me!');
			flag++;
		}
		if(flag > 3) {
			message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
			message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
		}
	}

};
