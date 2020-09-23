const Command = require('../../Structures/Command.js');
const userScheema = require('../../schemas/userSchema');
const { Permissions } = require('discord.js');
const permissions = new Permissions([
	'ADMINISTRATOR',
	'MANAGE_GUILD',
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
		const masterID = this.client.owners[0];
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
			message.reply('you do not have acess to this command!\n*I have told my master about this, you might get bot blocked!* :angry:');
			message.channel.send('<@' + masterID + '> this user tried to add users to me! <@' + id + '>');
			message.client.users.cache.get(masterID).send('Master this user tried to add users to me! <@' + id + '>');
			return;
		}
	}
};