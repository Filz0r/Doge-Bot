const Command = require('../../Structures/Command.js');
const userScheema = require('../../schemas/userSchema');
const { Permissions } = require('discord.js');
const USERS = require('../../Structures/user');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
	'BAN_MEMBERS',
	'KICK_MEMBERS',
	'MANAGE_CHANNELS',
]);
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'add',
			description: 'Gives users permission to use the giveaway commands.-ADMIN ONLY DO NOT TRY',
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
			await userScheema.findOneAndUpdate({ _id: newUser }, { host: true }).exec();
			message.reply(`<@!${ newUser }> was added as an authorized host!`);
			return console.log(`${ newUser } was added as an host by ${ tag } on ${ guild.name }`);
		}
		else {
			const reason = await USERS.autoModeration(id, tag, message, 1);
			await USERS.tellMod(message, id, reason);
			return;
		}
	}
};