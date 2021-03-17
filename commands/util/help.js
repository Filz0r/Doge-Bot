const { MessageEmbed, Permissions } = require('discord.js');
const USERS = require('../../controller/users');
const GUILD = require('../../controller/guilds');
const AUTOMOD = require('../../controller/automod');
const Command = require('../../controller/commands');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
	'BAN_MEMBERS',
	'KICK_MEMBERS',
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
		const { block } = await USERS.checkUser(id, tag);
		const guild = await GUILD.checkGuild(message);
		const prefix = guild.prefix !== this.client.prefix ? guild.prefix : this.client.prefix;
		if (!block) {
			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setAuthor(`${this.client.user.username} Help Menu`, message.guild.iconURL({ dynamic: true }))
				.setThumbnail(this.client.user.displayAvatarURL())
				.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			if (command) {
				const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
				if (!cmd) {
					console.log(`the user ${id} tried to look for the non-existent ${command} command.`)
					return message.channel.send(`Invalid command named:  \`${command}\`\n**THIS HAS BEEN LOGGED BUT DOES NOT TRIGGER AUTOMOD!**`);
				}
				if (!this.client.owners.includes(id) && message.member.hasPermission(permissions) && cmd.category !== 'Owner' && cmd.category === 'Admin') {
					embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
					embed.setDescription([
						`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
						`**❯ Description:** ${cmd.description}`,
						`**❯ Category:** ${cmd.category} `,
						`**❯ Usage:** ${cmd.usage}`,
					]);
					return message.channel.send(embed);
				} else if (!this.client.owners.includes(id) && !message.member.hasPermission(permissions) && cmd.category === 'Owner' || !this.client.owners.includes(id) && !message.member.hasPermission(permissions) && cmd.category === 'Admin' || !this.client.owners.includes(id) && message.member.hasPermission(permissions) && cmd.category === 'Owner') {
					console.log(`The user ${id} has tried to learn about the following command: ${command}`)
					return message.reply('This command exists, but it seems you are not allowed to use it, so please don\'t or you might get bot blocked!\n**THIS HAS BEEN LOGGED BUT DOES NOT TRIGGER AUTOMOD!**')
				} else {
					embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
					embed.setDescription([
						`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
						`**❯ Description:** ${cmd.description}`,
						`**❯ Category:** ${cmd.category} `,
						`**❯ Usage:** ${cmd.usage}`,
					]);
					return message.channel.send(embed);
				}
			}
			else {
				embed.setDescription([
					`**❯** <@${id}> here is my help menu!`,
					`**❯** The bot prefix is: \`${prefix}\``,
					`**❯** You can also use ${prefix}${this.client.commands.get('help').name} \`<commandname>\` to get additional help on the command you request`,
					'**❯** Command Parameters: `<>` is mandatory and `[]` is optional',
					'**❯ DO NOT TRY TO USE COMMANDS THAT DON\'T SHOW UP IN YOUR HELP COMMAND!**',
				]);
				let categories;
				if (!this.client.owners.includes(message.author.id) && !message.member.hasPermission(permissions)) {
					categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd =>
						!cmd.category.includes('Owner') && !cmd.category.includes('Admin'))
						.map(cmd => cmd.category))
				}
				else if (!this.client.owners.includes(message.author.id) || message.member.hasPermission(permissions)) {
					categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd =>
						!cmd.category.includes('Owner'))
						.map(cmd => cmd.category))
				} else {
					categories = this.client.utils.removeDuplicates(this.client.commands
						.map(cmd => cmd.category));
				}

				for (const category of categories) {
					embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
						cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
				}
				return message.channel.send(embed);
			}

		} else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};