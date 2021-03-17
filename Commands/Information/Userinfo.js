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
		const { id, tag } = message.author;
		const USER = await check.checkUser(id, tag);
		if(!USER.block) {

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
		if(USER.block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}

};
