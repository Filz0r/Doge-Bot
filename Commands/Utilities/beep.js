const Command = require('../../Structures/Command.js');
const USER = require('../../Structures/user.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'beep',
			description: 'beep!',
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message) {
		const { id, tag } = message.author;
		const { block } = await USER.checkUser(id, tag);
		if(!block) {
			message.reply('**BOOP**');
		}
		else if(block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};