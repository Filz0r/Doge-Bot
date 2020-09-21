const Command = require('../../Structures/Command.js');
const raid = require('../../Structures/raids.js');
const check = require('../../Structures/user.js');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'fc',
			aliases: ['raidinfo', 'ri'],
			category: 'Hosts',
			description: 'set your shiny raid info!',
			usage: '&description [IGN] [fc1] [fc2] [fc3] [AccName]',
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
				await raid.setRaidInfo(id, args);
				message.reply('your raid info is set!');
			}
			else {
				return await check.autoModeration(id, username, message);
			}
		}
	}
};