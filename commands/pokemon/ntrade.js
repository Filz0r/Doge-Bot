const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const GIVEAWAYS = require('../../controller/giveaways');
const AUTOMOD = require('../../controller/automod');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'nextrade',
			aliases: ['ntrade', 'nt', 'nextrade', 'nexttrade'],
			category: 'Pokemon',
			description: 'Starts next trade and deducts the mon that the last winner chose',
			usage: '<previousPokemon> CASE SENSITIVE',
			args: true,
		});
	}

	async run(message, args) {
		const { id, tag } = message.author;
		const { host, block } = await USERS.checkUser(id, tag);
		if(host && !block) {
			const argnum = args.length;
			const check = await GIVEAWAYS.check(id, args[0], message);
			if(!check) return;
			if (argnum > 2) return message.reply('incorrect syntax!');
			if (argnum === 2 && args[1] !== 'change') return message.reply('incorrect syntax!');
			if (argnum === 2 && args[1] === 'change') {
				const edits = await GIVEAWAYS.editList(id, args, message, this.client.prefix);
				if (!edits) return;
				const msg = await GIVEAWAYS.sendMsg(id);
				message.reply(`is hosting the following giveaway: ${ msg }`);
				const codes = await GIVEAWAYS.randCodeChange(id);
				return message.client.users.cache.get(id).send(`Your next trade code is  \`${ codes.code1 }-${ codes.code2 }\``);
			}
			else {
				const edits = await GIVEAWAYS.editList(id, args, message, this.client.prefix);
				if (!edits) return;
				const msg = await GIVEAWAYS.sendMsg(id, this.client.prefix, message);
				return message.reply(`is hosting the following giveaway: ${ msg }`);
			}
		} else if (!host && !block) {
			let { prefix } = await GUILDS.checkGuild(message)
			prefix === this.client.prefix ? prefix = this.client.prefix : prefix
			return message.reply(`It seems like you didn't activate this funcionality yet!\nUse \`${prefix}host\` to activate it!`);
		}
		else if (block && !host || block && host) {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 6);
			return await AUTOMOD.tellMod(message, id, reason);			
		}
	}
};