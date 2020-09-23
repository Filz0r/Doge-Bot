const Command = require('../../Structures/Command.js');
const userScheema = require('../../schemas/userSchema');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
	'BAN_MEMBERS',
	'KICK_MEMBERS',
	'MANAGE_CHANNELS',
]);
const USERS = require('../../Structures/user');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'block',
			description: 'Blocks users from using the bot!-ADMIN ONLY DO NOT TRY!',
			category: 'Admin',
			usage: '<mention user to add>',
		});
	}
	async run(message) {
		const { id, tag } = message.author;
		if(this.client.owners.includes(id) || message.member.hasPermission(permissions)) {
			const { mentions, guild } = message;
			const target = mentions.users.first();
			const newUser = target.id;
			await userScheema.findOneAndUpdate({ id: newUser }, { block: true }).exec();
			message.channel.send(`<@!${ newUser }> was blocked from using me!`);
			return console.log(`${ newUser } was blocked from using me by ${ tag } on ${ guild.name }`);

		}
		else {
			const reason = await USERS.autoModeration(id, tag, message, 2);
			await USERS.tellMod(message, id, reason);
			return;
		}
	}
};