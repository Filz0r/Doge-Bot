const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../package.json');
const check = require('../../Structures/user.js');
const Command = require('../../Structures/Command');
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
		const { id } = message.author;
		const { username } = message.author;
		await check.checkUser(id, username);
		const blockCheck = await check.blockCheck(id);
		let flag = 0;
		if(blockCheck === false) {
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

			message.channel.send(embed);
		}
		if(blockCheck === true) {
			message.reply('you are blocked from using me!');
			flag++;
			flag > 3 ? message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>') && message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>') : '';
		}
	}

};
