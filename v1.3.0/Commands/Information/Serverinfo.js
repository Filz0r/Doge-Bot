const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const check = require('../../Structures/user.js');

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South',
};

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays information about the server that said message was run in.',
			aliases: ['server', 'si'],
			category: 'Information',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const USER = await check.checkUser(id, tag);
		if(!USER.block) {

			const members = message.guild.members.cache;
			const embed = new MessageEmbed()
				.setDescription(`**Guild information for __${message.guild.name}__**`)
				.setColor('BLUE')
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.addField('General', [
					`**❯ Name:** ${message.guild.name}`,
					`**❯ ID:** ${message.guild.id}`,
					`**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
					`**❯ Region:** ${regions[message.guild.region]}`,
					`**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
					`**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
					`**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
					'\u200b',
				])
				.addField('Presence', [
					`**❯ Member Count:** ${message.guild.memberCount}`,
					`**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
					`**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
					`**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
					`**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
					`**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
					'\u200b',
				])
				.setTimestamp();
			message.channel.send(embed);
		}
		if(USER.block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}

};
