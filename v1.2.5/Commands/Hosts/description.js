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
		const { id, username } = message.author;
		const checking = await check.checkUser(id, username);
		if(checking === null) return message.reply('you don\'t have access to this command!');
		if(checking !== null) {
			const host = await checking.host;
			if(host === true) {
				const info = text;
				const textConv = info.join(' ');
				await creator.setDesc(id, textConv);
				return message.reply('Your custom description is set!');
			}
			else {
				return await check.autoModeration(id, username, message);
			}
		}
	}
};