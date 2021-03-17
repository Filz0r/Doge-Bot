const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const AUTOMOD = require('../../controller/automod')
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'host',
			description: 'Activates the host functionality enabling all the commands in this category for the user.',
			category: 'Pokemon',
			usage: '**Run the command without this part :clown:**',
		});
	}
	async run(message) {
		const { id, tag } = message.author;
		const { block } = await USERS.checkUser(id, tag);
		if (!block) {
			return await USERS.hostSwitch(message, id);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};