const check = require('../../Structures/user.js');
const Command = require('../../Structures/Command.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Ping!',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const { block } = await check.checkUser(id, tag);
		let flag = 0;
		if(!block) {
			message.reply('Pong.');
		}
		else if(block) {
			message.reply('you are blocked from using me!');
			flag++;
		}
		if(flag > 3) {
			message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
			message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
		}
	}
};