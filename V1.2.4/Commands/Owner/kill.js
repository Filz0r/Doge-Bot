const Command = require('../../Structures/Command.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'kill',
			category: 'Owner',
			description: '-ADMIN ONLY DO NOT TRY!-',
		});
	}
	async run(message) {
		const masterID = this.client.owners[0];
		const { id } = message.author;
		if (this.client.owners.includes(message.author.id)) {
			console.log('dogebot is going down!');
			await message.reply('you have terminated me master! :sob:');
			return await process.exit();
		}
		else {
			message.reply(' you do not have permission to do this!\n*I have told my master about this, you might get bot blocked!* :angry:');
			message.channel.send('<@' + masterID + '> this user tried to kill me! <@' + id + '>');
			message.client.users.cache.get(masterID).send('Master this user tried to kill me! <@' + id + '>');
		}
	}
};