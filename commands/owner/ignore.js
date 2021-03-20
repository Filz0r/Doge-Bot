const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const AUTOMOD = require('../../controller/automod');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ignore',
			description: 'forces the bot to ignore the user without any chance of this being removed.\nThis is an Owner only command, only my creator can use it!',
			category: 'Owner',
			usage: '<mention user to block>',
		});
	}
	async run(message) {
		const { id, tag } = message.author;
		if(this.client.owners.includes(id)) {
            return await USERS.ignoreSwitch(message);
		}
		else {
			const reason = await AUTOMOD.autoModeration(id, tag, message, 8);
			return await AUTOMOD.tellMod(message, id, reason);
		}
	}
};