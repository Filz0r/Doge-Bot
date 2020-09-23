const USER = require('../../Structures/user.js');
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
		const { block } = await USER.checkUser(id, tag);
		if(!block) {
			message.reply('Pong.');
		}
		else if(block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};