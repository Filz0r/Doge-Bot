const Command = require('../../controller/commands');
const AUTOMOD = require('../../controller/automod')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bs'],
			description: 'Updates the bot status',
			category: 'Owner',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		if (this.client.owners.includes(id)) {
			const content = message.content.replace(`${this.client.prefix}status`, '')
			this.client.user.setPresence({
				activity: { name: content },
				status: 'online'
			});
		} else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 1);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};

