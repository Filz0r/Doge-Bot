const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const { version } = require('../../package.json');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about the bot.',
			category: 'Owner',
			aliases: ['new'],
		});
	}

	async run(message) {
		const masterID = this.client.owners[0];
		const { id } = message.author;
		if (this.client.owners.includes(id)) {
			const embed = new MessageEmbed()
				.setColor(message.guild.me.displayHexColor || 'BLUE')
				.addField('New Update!', `**DogeBot v${version} is now online!**`);
			message.channel.send(embed);
		}
		else {
			message.reply(' you do not have permission to do this! :angry:');
			message.channel.send('<@' + masterID + '> this user used an owner command! <@' + id + '>');
			message.client.users.cache.get(masterID).send('Master this user tried to use an owner command! <@' + id + '>');
			return console.log(`id-${id} tried to run the new version command`);
		}

	}
};