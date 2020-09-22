const { MessageEmbed } = require('discord.js');
const check = require('../../Structures/user.js');
const Command = require('../../Structures/Command');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'MANAGE_CHANNELS',
]);
let flag = 0;

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'help',
			description: 'List all of my commands or info about a specific command.',
		});
	}


	async run(message, [command]) {
		const { id, tag } = message.author;
		const checking = await check.checkUser(id, tag);
		let host = false;
		checking !== null ? host = await checking.host : host;

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
				return message.client.users.cache.get(id).send(embed);
			}
			else {
				embed.setDescription([
					`**❯** The bot prefix is: ${this.client.prefix}`,
					`**❯** You can also use ${this.client.prefix}help \`<commandname>\` to get additional help on the command you request`,
					'**❯** Command Parameters: `<>` is mandatory & `[]` is optional',
					'**❯ If you want to become an authorized host just ping my creator, he will add you when possible!**',
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
						.filter(cmd => cmd.category !== 'Owner')
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
		if(checking.block && flag < 3) {
			message.reply('you are blocked from using me!');
			return flag++;
		}
		if(flag >= 3) {
			await check.autoModeration(id, tag, message);
			message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
			return;
		}
	}
};