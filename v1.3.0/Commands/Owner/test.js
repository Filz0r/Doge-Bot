const Command = require('../../Structures/Command.js');
const USER = require('../../Structures/user');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'test',
			description: 'test',
			category: 'Owner',
			args: true,
		});
	}
	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const { id, tag } = message.author;
		if (this.client.owners.includes(id)) {
			//
		}
		else {
			const reason = await USER.autoModeration(id, tag, message, 10);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};