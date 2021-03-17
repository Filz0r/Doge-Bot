const Command = require('../../Structures/Command.js');
const creator = require('../../Structures/filecreator.js');
const check = require('../../Structures/user.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'description',
			aliases: ['desc'],
			category: 'Hosts',
			description: 'set a personalized description for your giveaway!',
			usage: '&description <text>, please do not use emoji or pings because the format is not compatible with them.',
			args: true,
		});
	}


	async run(message, text) {
		const { id } = message.author;
		const { username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				const info = text;
				const textConv = info.join(' ');
				await creator.setDesc(id, textConv);
				message.reply('Your custom description is set!');
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