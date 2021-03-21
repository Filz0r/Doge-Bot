const { MessageEmbed } = require('discord.js');
const Command = require('../../controller/commands');

const AUTOMOD = require('../../controller/automod');
const { updateNotice } = require('../../controller/owner-backend');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about the bot.',
			category: 'Owner',
			aliases: ['new'],
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		if (this.client.owners.includes(id)) {
            return await updateNotice(message);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 9);
			return await AUTOMOD.tellMod(message, id, reason);
		}

	}
};