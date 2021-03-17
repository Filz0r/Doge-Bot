const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const GUILDS = require('../../controller/guilds');
const GIVEAWAY = require('../../controller/giveaways');
const AUTOMOD = require('../../controller/automod')
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'giveaway',
			description: 'Command for hosting Pokemon Sword/Shield giveaways',
			category: 'Pokemon',
			usage: '**guide** for more in depth guide',
			aliases: ['ga', 'give'],
			args: true,
		});
	}
	// eslint-disable-next-line no-unused-vars
	async run(message, args, text) {
		const { id, tag } = message.author;
		const { host, block } = await USERS.checkUser(id, tag);
		const argnum = args.length;
		const subcmd = args[0].toLowerCase();
		if (host && !block) {
			if (subcmd === 'start' && argnum > 2) return message.reply(`incorrect syntax!\n Use \`${this.client.prefix}${this.client.commands.get('giveaway').name} guide\` for help!`);
			if (subcmd === 'info' && argnum !== 6) return message.reply(`incorrect syntax!\n Use \`${this.client.prefix}${this.client.commands.get('giveaway').name} guide\` for help!`);
			if (subcmd !== 'desc' && argnum >= 61) return message.reply('you are trying to give to many pokemon, limit is 30!');
			if (subcmd === 'start' && args[1] === 'change') {
				const msg = await GIVEAWAY.sendMsg(id);
				message.reply('is starting the following giveaway!\n' + msg);
				const codes = await GIVEAWAY.randCodeChange(id);
				return message.client.users.cache.get(id).send(`Your next trade code is  \`${codes.code1}-${codes.code2}\``);
			}
			else if (subcmd === 'start') {
				const msg = await GIVEAWAY.sendMsg(id, this.client.prefix, message);
				return message.reply('is starting the following giveaway!\n' + msg);
			}
			if (subcmd === 'info') {
				await GIVEAWAY.setInfo(id, args, message);
				return message.reply('info is stored!');
			}
			if (subcmd === 'guide') {
				const embed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'BLUE')
					.addField('Guide for using the giveaway command!', [
						`**1 ❯** To store the list of pokemon you want to giveaway use the following syntax, keep in mind that as of right now the list is limited to 30 different pokemon \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} <Name> <Quantity>\nExample:example: ${this.client.prefix}${this.client.commands.get('giveaway').name} Mew 10 Zarude 10\`\`\``,
						`**2 ❯** To store your info use the syntax bellow. DD and ping can be stored as a simple yes or no. \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} info <IGN> <Code1> <Code2> <DD> <Ping>\`\`\``,
						`**3 ❯**  To store a custom description for your giveaway, <text> is literally a custom text you can set with the command, avoid emotes and mentions as they will not show up on the output. It has a default option making this optional  \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} desc <text>\`\`\``,
						`**4 ❯** When you are ready to search, you can start the giveaways in any channel the bot is allowed to post \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} start\`\`\``,
						`**5 ❯** Use the syntax showed bellow to update your list, name is the last pokemon picked, even if you only are giving away one kind of pokemon \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} <name>\`\`\``,
					])
					.setFooter('Page 1 of 2');
				const newEmbed = new MessageEmbed()
					.setColor(message.guild.me.displayHexColor || 'BLUE')
					.addField('Using the random code functionality', [
						`**1 ❯** If you dont feel like thinking about a code for your trades the bot has you covered! The bot creates one for you by using following syntax on the **&ga info** command: \`\`\`${this.client.prefix}ga info <ign> RAND RAND <dd> <ping>\`\`\``,
						'**2 ❯** You have now noticed that the bot sent you a DM with a code ```MAKE SURE YOU HAVE DM TURNED ON WHEN USING THE BOT!```',
						`**3 ❯** You can also do this while hosting the giveaways by using the followin syntax on these 2 commands: \`\`\`${this.client.prefix}${this.client.commands.get('giveaway').name} start change\n${this.client.prefix}${this.client.commands.get('nextrade').name} <name> change\`\`\``,
						'**4 ❯** Keep in mind the following things:',
						'\u3000**4.1 ❯** This bot works with free tier servers so they are not the best, in result he might take a while to reply to you when using these commands',
						'\u3000**4.2 ❯** Try to not use these commands if an other user has just used them, as this might result in it getting an error and outputing nothing, again slow servers.',
						'\u3000**4.3 ❯** There are many commands that are case sensitive, please use the syntax as provided in this guide',
					])
					.setFooter('page 2 of 2');
				message.reply('the guide for this command has been sent to your DM!');
				return message.client.users.cache.get(id).send(embed).then((msg) => {
					msg.react('⬅️').then(() => {
						msg.react('➡️').then(() => {
							const filter = (reaction, user) => (reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️') && user.id !== message.client.user.id;
							const collector = msg.createReactionCollector(filter, { time: 15000 });
							collector.on('collect', col => {
								if (col.emoji.name === '➡️') {
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
			if (subcmd === 'desc') {
				const info = args;
				const textConv = info.slice(1, args.length).join(' ');
				await GIVEAWAY.setDesc(id, textConv);
				return message.reply('your custom description is set!');
			}
			if (subcmd !== 'info' && subcmd !== 'start' && subcmd !== 'guide' && subcmd !== 'desc') {
				await GIVEAWAY.setList(id, args, message);
				return message.reply('your list has been stored!');
			}
		}
		else if (!host && !block) {
			let { prefix } = await GUILDS.checkGuild(message)
			prefix === this.client.prefix ? prefix = this.client.prefix : prefix
			return message.reply(`It seems like you didn't activate this funcionality yet!\nUse \`${prefix}host\` to activate it!`);
		}
		else if (!host && block || host && block) {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);			
		}
	}
};