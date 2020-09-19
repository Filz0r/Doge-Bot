const Command = require('../../Structures/Command.js');
const check = require('../../Structures/user.js');
const giveaway = require('../../Structures/giveaway.js');
const create = require('../../Structures/filecreator.js');
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
		const { id } = message.author;
		const { username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				if(args[0] === 'start' && args[1] === 'change') {
					const msg = await giveaway.sendMsg(id);
					message.reply('is starting the following giveaway!\n' + msg);
					const codes = await giveaway.randCodeChange(id);
					message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
					return;
				}
				else if (args[0] === 'start' && argnum === 1) {
					const msg = await giveaway.sendMsg(id);
					message.reply('is starting the following giveaway!\n' + msg);
					return;
				}
				if(args[0] === 'info' && argnum === 6) {
					await create.setInfo(id, args, message);
					message.reply('info is stored!');
					return;
				}
				if(args[0] !== 'info' && args[0] !== 'bla' && args[0] !== 'start') {
					await create.setList(id, args);
					message.reply('your list has been stored!');
					return;
				}
				return;
			}
			else {
				await check.checkUser(id, username);
				const blockCheck = await check.blockCheck(id);
				const blockChecked = blockCheck;
				const flagCheck = await check.flagCheck(id);
				let flags = flagCheck;
				if(blockChecked === true) {
					const flagging = await check.flagUser(id);
					flags = flagging;
					message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
					message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
				}
				else if (flags === 0) {
					const flagging = await check.flagUser(id);
					flags = flagging;
					message.reply('*you have be flagged **' + flagging + '** times, at 10 you get blocked!*');
					return flags;
				}
				else if(flags > 0 && flags <= 9) {
					const flagging = await check.flagUser(id);
					flags = flagging;
					message.reply('*you have be flagged **' + flagging + '** times, at 10 you get blocked!*');
					return flags;
				}
				else if(flags >= 10) {
					const block = await check.blockUser(id);
					const flagging = await check.flagUser(id);
					flags = flagging;
					console.log(id + ' block = ' + block);
					message.reply('**you have been blocked from using me!**');
					return flags;
				}
			}
		}
		else {
			message.reply('you don\'t have acess to this command!');
		}
	}
};