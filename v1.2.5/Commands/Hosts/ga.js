const Command = require('../../Structures/Command.js');
const check = require('../../Structures/user.js');
const giveaway = require('../../Structures/giveaway.js');
const create = require('../../Structures/filecreator.js');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ga',
			aliases: ['giveaway'],
			category: 'Hosts',
			description: 'Giveaway startup module!',
			usage: '!ga <name> <quant> | !ga info <IGN> <CODE1> <CODE2> <DD(YES/NO)> <PING(YES/NO)> | !ga start(posts the layout on the page you type it)',
			args: true,
		});
	}


	async run(message, args) {
		const argnum = args.length;
		const { id, username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking === null) return message.reply('you don\'t have access to this command!');
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				if (args[0] === 'start' && argnum > 2) return message.reply('incorrect syntax! Use **&ga guide** for help!');
				if (args[0] === 'info' && argnum !== 6) return message.reply('incorrect syntax! Use **&ga guide** for help!');
				if (argnum >= 61) return message.reply('you are trying to give to many pokemon, limit is 30!');
				if(args[0] === 'start' && args[1] === 'change') {
					const msg = await giveaway.sendMsg(id);
					message.reply('is starting the following giveaway!\n' + msg);
					const codes = await giveaway.randCodeChange(id);
					return message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
				}
				else if (args[0] === 'start') {
					const msg = await giveaway.sendMsg(id);
					return message.reply('is starting the following giveaway!\n' + msg);
				}
				if(args[0] === 'info') {
					await create.setInfo(id, args, message);
					return message.reply('info is stored!');
				}
				if (args[0] === 'guide') {
					const embed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'BLUE')
						.addField('Guide for using the giveaway command!', [
							`**1 ❯** To store the list of pokemon you want to giveaway use the following syntax, keep in mind that as of right now the list is limited to 30 different pokemon \`\`\`${this.client.prefix}&ga <Name> <Quantity>\nExample:example: ${this.client.prefix}ga Mew 10 Zarude 10\`\`\``,
							`**2 ❯** To store your info use the syntax bellow. DD and ping can be stored as a simple yes or no. \`\`\`${this.client.prefix}ga info <IGN> <Code1> <Code2> <DD> <Ping>\`\`\``,
							`**3 ❯**  To store a custom description for your giveaway, <text> is literally a custom text you can set with the command, avoid emotes and mentions as they will not show up on the output. It has a default option making this optional  \`\`\`${this.client.prefix}description <text>\`\`\``,
							`**4 ❯** When you are ready to search, you can start the giveaways in any channel the bot is allowed to post \`\`\`${this.client.prefix}ga start\`\`\``,
							`**5 ❯** Use the syntax showed bellow to update your list, name is the last pokemon picked, even if you only are giving away one kind of pokemon \`\`\`${this.client.prefix}ntrade <name>\`\`\``,
						])
						.setFooter('Page 1 of 2');
					const newEmbed = new MessageEmbed()
						.setColor(message.guild.me.displayHexColor || 'BLUE')
						.addField('Using the random code functionality', [
							`**1 ❯** If you dont feel like thinking about a code for your trades the bot has you covered! The bot creates one for you by using following syntax on the **&ga info** command: \`\`\`${this.client.prefix}ga info <ign> RAND RAND <dd> <ping>\`\`\``,
							'**2 ❯** You have now noticed that the bot sent you a DM with a code ```MAKE SURE YOU HAVE DM TURNED ON WHEN USING THE BOT!```',
							`**3 ❯** You can also do this while hosting the giveaways by using the followin syntax on these 2 commands: \`\`\`${this.client.prefix}ga start change\n${this.client.prefix}ntrade <name> change\`\`\``,
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
				if(args[0] !== 'info' && args[0] !== 'start' && args[0] !== 'guide') {
					await create.setList(id, args);
					return message.reply('your list has been stored!');
				}
			}
			else {
				return await check.autoModeration(id, username, message);
			}
		}
	}
};