const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../package.json');
const USERS = require('../../controller/users');
const AUTOMOD =  require('../../controller/automod')
const Command = require('../../controller/commands');
const { utc } = require('moment');
const os = require('os');
const ms = require('ms');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about the bot.',
			category: 'Information',
			aliases: ['bot', 'boti'],
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const { block } = await USERS.checkUser(id, tag);
		if(!block) {
			const core = os.cpus()[0];
			const embed = new MessageEmbed()
				.setThumbnail(this.client.user.displayAvatarURL())
				.setColor(message.guild.me.displayHexColor || 'BLUE')
				.addField('General', [
					`**❯ Client:** ${this.client.user.tag}`,
					`**❯ Commands:** ${this.client.commands.size}`,
					`**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()} `,
					`**❯ Users:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
					`**❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
					'\u200b',
				])
				.addField('System', [
					`**❯ Node.js:** ${process.version}`,
					`**❯ Version:** v${version}`,
					`**❯ Discord.js:** v${djsversion}`,
					`**❯ Platform:** ${process.platform}`,
					`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: false })}`,
					'**❯ CPU:**',
					`\u3000 Cores: ${os.cpus().length}`,
					`\u3000 Model: ${core.model}`,
					`\u3000 Speed: ${core.speed}MHz`,
					'**❯ Memory:**',
					`\u3000 Total: ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
					`\u3000 Used: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}`,
				])
				.setTimestamp();

			return message.channel.send(embed);
		} else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};