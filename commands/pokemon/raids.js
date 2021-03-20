const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const RAIDS = require('../../controller/raids');
const GUILDS = require('../../controller/guilds')
const AUTOMOD = require('../../controller/automod')
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'raid',
			category: 'Hosts',
			description: 'set a the description for your shiny raid',
			usage: ' **guide** for an detailed guide on how to use this command',
			args: true,
		});
	}

	async run(message, args) {
		const { id, tag } = message.author;
		const { host, block } = await USERS.checkUser(id, tag);
		const subcmd = args[0].toLowerCase();
		if(!block && host) {
			if(subcmd === 'manual' && args.length > 9) return message.reply(`incorrect syntax!\nUse \`${this.client.prefix}${this.client.commands.get('raid').name} guide\` for information on the correct syntax`);
			if(subcmd === 'auto' && args.length > 10) return message.reply(`incorrect syntax!\nUse \`${this.client.prefix}${this.client.commands.get('raid').name} guide\` for information on the correct syntax`);

			if(subcmd === 'guide' && args.length !== 1) return message.reply(`incorrect syntax!\nUse \`${this.client.prefix}${this.client.commands.get('raid').name} guide\` for information on the correct syntax`);
			if(subcmd === 'send' && args.length !== 1) return message.reply(`incorrect syntax!\nUse \`${this.client.prefix}${this.client.commands.get('raid').name} guide\` for information on the correct syntax`);
			if(subcmd === 'change' && args.length !== 2) return message.reply(`incorrect syntax!\nUse \`${this.client.prefix}${this.client.commands.get('raid').name} guide\` for information on the correct syntax`);

			if (subcmd === 'send') {
				const msg = await RAIDS.sendRaidMsg(id);
				if (!msg) return message.reply('you do not have any shiny raid info stored!');
				return message.reply('is hosting the following shiny raid!\n' + msg).then(async msg => {
					return await RAIDS.raidSwitch('active', id, message, msg.id, msg.channel.id, msg.guild.id)
				});
			}
			else if (subcmd === 'change') {
				await RAIDS.changeFixMon(id, args[1]);
				return message.reply('you have changed your current hosted pokemon to: ' + args[1]);
			}
			else if (subcmd === 'guide') {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'BLUE')
					.addField('Guide for using the shiny raid host command!', [
						`**1 ❯** To add your friend code(FC), switch account name(name) and in game name(IGN) use \`\`\`${this.client.prefix}${this.client.commands.get('raid').name} fc <IGN> <name> <FC1> <FC2> <FC3> \`\`\``,
						`**2 ❯ Autohosts** use this \`\`\`${this.client.prefix}${this.client.commands.get('raid').name} auto <den number> <rotating/fixed> <game> <code1> <code2> <timer> <star/square> <stars> [current pokemon]\`\`\``,
						`**3 ❯ Manual hosters** use this \`\`\`${this.client.prefix}${this.client.commands.get('raid').name} manual <den number> <rotating/fixed> <game> <code1> <code2> <star/square> <stars> [current pokemon]\`\`\``,
						`**4 ❯** To post the layout **in the channel you want it to be posted in** use: \`\`\`${this.client.prefix}${this.client.commands.get('raid').name} send\`\`\``,
						`**5 ❯** If you want to change the pokemon in your layout use(keep in mind that you have to resend the message to the channel): \`\`\`${this.client.prefix}${this.client.commands.get('raid').name} change [pokemon]\`\`\``,
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
			else if (subcmd === 'info') {
				await RAIDS.setRaidInfo(id, args);
				return message.reply('your host information has been stored!');
			}
			else if (subcmd === 'end') {
				return await RAIDS.raidSwitch('ended', id, message)
				
			} else {
				const desc = await RAIDS.setRaidDesc(id, args);
				if(!desc) return message.reply(`there was an error with one of these things \`${ args[0] }, ${ args[2] }, ${ args[8].length && subcmd === 'auto' !== 3 ? args[8] : args[7].length && subcmd === 'manual' !== 3 ? args[7] : ''} \``);
				return message.reply('your raid info has been stored!');
			}
		} else if (!host && !block) {
			let { prefix } = await GUILDS.checkGuild(message)
			prefix === this.client.prefix ? prefix = this.client.prefix : prefix
			return message.reply(`It seems like you didn't activate this funcionality yet!\nUse \`${prefix}host\` to activate it!`);
		} else if (block && !host || block && host) {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);			
		}
	}
};