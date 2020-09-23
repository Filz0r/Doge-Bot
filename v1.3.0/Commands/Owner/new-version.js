const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const { version } = require('../../package.json');
const USER = require('../../Structures/user');
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
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'BLUE')
				.addField('New Update!', `**DogeBot v${version} is now online!**`);
			message.channel.send(embed);
		}
		else {
			const reason = await USER.autoModeration(id, tag, message, 10);
			await USER.tellMod(message, id, reason);
			return;
		}

	}
};