const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const check = require('../../Structures/user.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about a provided user or the message author.',
			category: 'Information',
			usage: '[user]',
		});
	}

	async run(message, [target]) {
		const { id } = message.author;
		const { username } = message.author;
		await check.checkUser(id, username);
		const blockCheck = await check.blockCheck(id);
		let flag = 0;
		if(blockCheck === false) {

			const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;
			const embed = new MessageEmbed()
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
				.setColor(member.displayHexColor || 'BLUE')
				.addField('User', [
					`**❯ Username:** ${member.user.username}`,
					`**❯ Discriminator:** ${member.user.discriminator}`,
					`**❯ ID:** ${member.id}`,
					`**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
					`**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
					`**❯ Status:** ${member.user.presence.status}`,
					`**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
					`**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
					'\u200b',
				]);
			return message.channel.send(embed);
		}
		if(blockCheck === true) {
			message.reply('you are blocked from using me!');
			flag++;
			flag > 3 ? message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>') && message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>') : '';
		}
	}

};
