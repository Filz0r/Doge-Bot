const Command = require('../../Structures/Command.js');
// const USERS = require('../../Structures/user');
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
		// const { id, tag } = message.author;
		// const USER = await USERS.checkUser(id, tag);
		console.log(message.guild.roles);
	}
};