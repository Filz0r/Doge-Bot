const { MessageEmbed } = require('discord.js');
const USER = require('../../Structures/user.js');
const GUILD = require('../../Structures/guilds');
const Command = require('../../Structures/Command');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'MANAGE_CHANNELS',
]);


module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'help',
			description: 'List all of my commands or info about a specific command.',
		});
	}


	async run(message, [command]) {
		const { id, tag } = message.author;
		const checking = await USER.checkUser(id, tag);
		let host = false;
		checking !== null ? host = await checking.host : host;
		const guild = await GUILD.checkGuild(message);
		const prefix = guild.prefix !== this.client.prefix ? guild.prefix : this.client.prefix;
		if(!checking.block) {
			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setAuthor(`${this.client.user.username} Help Menu`, message.guild.iconURL({ dynamic: true }))
				.setThumbnail(this.client.user.displayAvatarURL())
				.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			if(command) {
				const cmd = this.client.commands.get(command) || this.client.commands.get(this.aliases.get(command));

				if(!cmd) return message.channel.send(`Invalid command named:  \`${command}\``);

				embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
				embed.setDescription([
					`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
					`**❯ Description:** ${cmd.description}`,
					`**❯ Category:** ${cmd.category} `,
					`**❯ Usage:** ${cmd.usage}`,
				]);
				message.client.users.cache.get(id).send(embed);
				return message.reply('my help menu has been sent to your dm!');
			}
			else {
				embed.setDescription([
					`**❯** The bot prefix is: \`${prefix}\``,
					`**❯** You can also use ${prefix}${this.client.commands.get('help').name} \`<commandname>\` to get additional help on the command you request`,
					'**❯** Command Parameters: `<>` is mandatory and `[]` is optional',
					'**❯ If you want to become an authorized host just and moderator, he will add you when possible!**',
					'**❯ DO NOT TRY TO USE COMMANDS THAT DON\'T SHOW UP IN YOUR HELP COMMAND!**',

				]);
				let categories;
				if (!this.client.owners.includes(message.author.id) && !message.member.hasPermission(permissions)) {
					host ? categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd =>
						!cmd.category.includes('Owner') && !cmd.category.includes('Admin'))
						.map(cmd => cmd.category)) :
						categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd =>
							!cmd.category.includes('Owner') && !cmd.category.includes('Hosts') && !cmd.category.includes('Admin'))
							.map(cmd => cmd.category));
				}
				else {
					categories = this.client.utils.removeDuplicates(this.client.commands
						.map(cmd => cmd.category));
				}

				for (const category of categories) {
					embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
						cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
				}
				message.client.users.cache.get(id).send(embed);
				return message.reply('my help menu has been sent to your dm!');
			}

		}
		if(checking.block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};