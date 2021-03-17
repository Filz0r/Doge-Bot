const Command = require('../../controller/commands');
const AUTOMOD = require('../../controller/automod')
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
		if (this.client.owners.includes(id)) {
			console.log('dogebot is going down!');
			await message.reply('you have terminated me master! :sob:');
			return process.exit();
		}
		else {			
			message.reply(' you don\'t have permission to do this! :angry:');
			message.client.users.cache.get(masterID).send('Master this user tried to kill me! <@' + id + '>');
			console.log(`id- ${id} tried to run the kill command`);
			const reason = await AUTOMOD.autoModeration(id, tag, message, 5);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};