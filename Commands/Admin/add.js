const Command = require('../../Structures/Command.js');
const mongo = require('../../Structures/mongo');
const userScheema = require('../../schemas/userSchema');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'add',
			description: 'Gives users permission to use the giveaway commands.-ADMIN ONLY DO NOT TRY',
			category: 'Admin',
			usage: '<mention user to add>',
			args: true,
		});
	}
	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const masterID = this.client.owners[0];
		const { id } = message.author;
		if(this.client.owners.includes(message.author.id) || this.client.admin.includes(message.author.id)) {
			const { mentions } = message;
			const target = mentions.users.first();
			const newUser = target.id;
			await mongo().then(async (mongoose) => {
				try {
					await userScheema.findOneAndUpdate(
						{
							id: newUser,
						},
						{
							host: true,
						}, {
							upsert: true,
							useFindAndModify: false,
						},
					)
						.exec();
					message.reply(' user added!');
				}
				finally {
					mongoose.connection.close();
					console.log('User add finished');
				}
			});
		}
		else {
			message.reply('you do not have acess to this command!\n*I have told my master about this, you might get bot blocked!* :angry:');
			message.channel.send('<@' + masterID + '> this user tried to add users to me! <@' + id + '>');
			message.client.users.cache.get(masterID).send('Master this user tried to add users to me! <@' + id + '>');
		}
	}
};