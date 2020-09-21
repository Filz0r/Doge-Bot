const Command = require('../../Structures/Command.js');
const check = require('../../Structures/user.js');
const raids = require('../../Structures/raids');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'raid',
			category: 'Hosts',
			description: 'set a the description for your shiny raid',
			usage: '',
			args: true,
		});
	}

	async run(message, args) {
		const { id, username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking === null) return message.reply('you don\'t have access to this command!');
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				console.log(args.length);
				if(args[0] === 'manual' && args.length > 9) return message.reply(`incorrect syntax!\nUse **${this.client.prefix}raid guide** for information on the correct syntax`);
				if(args[0] === 'guide' && args.length !== 1) return message.reply(`incorrect syntax!\nUse **${this.client.prefix}raid guide** for information on the correct syntax`);
				if(args[0] === 'auto' && args.length > 10) return message.reply(`incorrect syntax!\nUse **${this.client.prefix}raid guide** for information on the correct syntax`);
				if(args[0] === 'send' && args.length !== 1) return message.reply(`incorrect syntax!\nUse **${this.client.prefix}raid guide** for information on the correct syntax`);
				if(args[0] === 'change' && args.length !== 2) return message.reply(`incorrect syntax!\nUse **${this.client.prefix}raid guide** for information on the correct syntax`);
				if (args[0] === 'send') {
					const msg = await raids.sendRaidMsg(id);
					return message.reply('is hosting the following shiny raid!\n' + msg);
				}
				else if (args[0] === 'change') {
					await raids.changeFixMon(id, args[1]);
					return message.reply('you have changed your current hosted pokemon to: ' + args[1]);
				}
				else if (args[0] === 'guide') {
					const embed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'BLUE')
						.addField('Guide for using the shiny raid host command!', [
							`**1 ❯** To add your friend code(FC), switch account name(name) and in game name(IGN) use \`\`\`${this.client.prefix}fc <IGN> <FC1> <FC2> <FC3> <name>\`\`\``,
							`**2 ❯ Autohosts** use this \`\`\`${this.client.prefix}raid auto <den number> <rotating/fixed> <game> <code1> <code2> <timer> <star/square> <stars> [current pokemon]\`\`\``,
							`**3 ❯ Manual hosters** use this \`\`\`${this.client.prefix}raid manual <den number> <rotating/fixed> <game> <code1> <code2> <star/square> <stars> [current pokemon]\`\`\``,
							`**4 ❯** To post the layout **in the channel you want it to be posted in** use: \`\`\`${this.client.prefix}raid send\`\`\``,
							`**5 ❯** If you want to change the pokemon in your layout use(keep in mind that you have to resend the message to the channel): \`\`\`${this.client.prefix}raid change [pokemon]\`\`\``,
						])
						.setFooter('Page 1 of 2');
					const newEmbed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'BLUE')
						.addField('Additional information:', [
							'**1 ❯** On the options above you have to input one of the words inside the <> ```<rotating/fixed> <star/square>```',
							'**2 ❯** The **<timer>** argument on **autohosts** is expected to look like this: ```1:30, 2:00```',
							'**3 ❯** The **<stars>** argument is expected to look like one of the bellow examples: ```1, 1-2, 3, 3-5```',
							'**4 ❯** Please do not forget that: ```arguments inside <> are mandatory and that arguments inside [] are optional!```',
							'**5 ❯** Please send all your commands in a single line or it will deform the bot\'s output!',
						])
						.setFooter('page 2 of 2');
					message.reply('the guide for this command has been sent to your DM!');
					return message.client.users.cache.get(id).send(embed).then((msg) => {
						msg.react('⬅️').then(() => {
							msg.react('➡️').then(() => {
								const filter = (reaction, user) => (reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️') && user.id !== message.client.user.id;
								const collector = msg.createReactionCollector(filter, { time: 15000 });
								collector.on('collect', col => {
									if(col.emoji.name === '➡️') {
										msg.edit(newEmbed);
									}
									else if (col.emoji.name === '⬅️') {
										msg.edit(embed);
									}
								});
							});
						});
					});
				}
				else {
					await raids.setRaidDesc(id, args);
					return message.reply('your raid info has been stored!');
				}
			}
			else {
				return await check.autoModeration(id, username, message);
			}
		}
	}
};