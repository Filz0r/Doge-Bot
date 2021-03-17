const Command = require('../../Structures/Command.js');
const check = require('../../Structures/user.js');
const giveaway = require('../../Structures/giveaway.js');
const creator = require('../../Structures/filecreator.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'nextrade',
			aliases: ['ntrade', 'nt', 'nextrade', 'nexttrade'],
			category: 'Hosts',
			description: 'Starts next trade and deducts the mon that the last winner chose',
			usage: '&ntrade <name> CASE SENSITIVE',
			args: true,
		});
	}

	async run(message, args) {
		const { id } = message.author;
		const { username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				const argnum = args.length;
				if (argnum === 2 && args[1] === 'change') {
					const reducer = await creator.setList(id, args, message);
					if(reducer) {
						const msg = await giveaway.sendMsg(id);
						message.channel.send(msg);
						const codes = await giveaway.randCodeChange(id);
						message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
						return;
					}
				}
				else if(argnum === 1) {
					const reducer = await creator.setList(id, args, message);
					if(reducer) {
						message.channel.send(await giveaway.sendMsg(id));
					}
					else {
						message.reply('incorrect syntax!');
					}
					return;
				}
				else {
					message.reply('incorrect syntax!');
					return;
				}
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
					message.channel.send('<@' + this.client.admin[0] + '> this user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
					message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
				}
				else if (flags === 0) {
					const flagging = await check.flagUser(id);
					flags = flagging;
					message.reply('you don\'t have access to this bot!');
					return flags;
				}
				else if(flags >= 1 && flags <= 9) {
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
					message.reply('**you have been blocked from using me! :angry:**');
					return flags;
				}
				return;
			}
		}
		else {
			message.reply('you don\'t have acess to this command!');
			return;
		}
	}
};