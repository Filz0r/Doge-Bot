const Command = require('../../Structures/Command.js');
const USER = require('../../Structures/user');
const GIVEAWAY = require('../../Structures/giveaway');
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
		const { id, tag } = message.author;
		const { host } = await USER.checkUser(id, tag, message);
		if(host) {
			const argnum = args.length;
			const check = await GIVEAWAY.check(id, args[0], message);
			if(!check) return;
			if (argnum > 2) return message.reply('incorrect syntax!');
			if (argnum === 2 && args[1] !== 'change') return message.reply('incorrect syntax!');
			if (argnum === 2 && args[1] === 'change') {
				const edits = await GIVEAWAY.editList(id, args, message, this.client.prefix);
				if (!edits) return;
				const msg = await GIVEAWAY.sendMsg(id);
				message.reply(`is hosting the following giveaway: ${ msg }`);
				const codes = await GIVEAWAY.randCodeChange(id);
				return message.client.users.cache.get(id).send(`Your next trade code is  \`${ codes.code1 }-${ codes.code2 }\``);
			}
			else {
				const edits = await GIVEAWAY.editList(id, args, message, this.client.prefix);
				if (!edits) return;
				const msg = await GIVEAWAY.sendMsg(id, this.client.prefix, message);
				return message.reply(`is hosting the following giveaway: ${ msg }`);
			}
		}
		else {
			const reason = await USER.autoModeration(id, tag, message, 8);
			await USER.tellMod(message, id, reason);
			return;
		}

	}
};