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
		const { id, username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking === null) return message.reply('you don\'t have access to this command!');
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				const argnum = args.length;
				if (argnum > 2) return message.reply('incorrect syntax!');
				if (argnum === 2 && args[1] !== 'change') return message.reply('incorrect syntax!');
				if (argnum === 2 && args[1] === 'change') {
					await creator.setList(id, args, message);
					const msg = await giveaway.sendMsg(id);
					message.channel.send(msg);
					const codes = await giveaway.randCodeChange(id);
					return message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
				}
				else {
					await creator.setList(id, args, message);
					return message.channel.send(await giveaway.sendMsg(id));
				}
			}
			else {
				return await check.autoModeration(id, username, message);
			}
		}
	}
};