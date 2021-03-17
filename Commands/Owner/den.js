const Command = require('../../Structures/Command.js');
const denSchema = require('../../schemas/denSchema');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'den',
			description: 'updates the dens stored in the database.-ADMIN ONLY DO NOT TRY',
			category: 'Owner',
			args: true,
		});
	}
	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const masterID = this.client.owners[0];
		const { id } = message.author;
		const deleteKey = (obj, path) => {
			const _obj = JSON.parse(JSON.stringify(obj));
			const keys = path.split('.');

			keys.reduce((acc, key, index) => {
				if (index === keys.length - 1) {
					delete acc[key];
					return true;
				}
				return acc[key];
			}, _obj);

			return _obj;
		};
		if(this.client.owners.includes(message.author.id)) {
			let i = 0;
			const data = [];
			let oldData = '';
			const gameToAdd = args[1];
			const stars = args[2];

			for (i = 0; i < args.length - 3; i++) {
				data.push(args[i + 3]);
			}

			const checkDen = await denSchema.findOne({
				_id: args[0],
			});

			oldData = checkDen;

			if (oldData !== null) {
				const game = oldData[gameToAdd];
				game[stars] = data;
				const PATH = '__v';
				oldData = deleteKey(oldData, PATH);

				const result = await denSchema.updateOne({
					_id: args[0],
				},
				{
					$set: oldData,
				},
				{
					upsert: true,
					new: true,
				});
				console.log('edited info on den ' + args[0]);
				return result;
			}
			else if (oldData === null) {
				const result = await denSchema.findOneAndUpdate({
					_id: args[0],
				},
				{
					[gameToAdd]: {
						[stars]: data,
					},
				},
				{
					upsert: true,
					new: true,
					useFindAndModify: false,
				});
				console.log('RES:', result);
				console.log('added info on den ' + args[0] + ' to the database');
				return result;
			}

		}
		else {
			message.reply('you do not have acess to this command! :angry:');
			message.channel.send('<@' + masterID + '> this user tried to edit the dens! <@' + id + '>');
			message.client.users.cache.get(masterID).send('Master this user tried to edit the dens! <@' + id + '>');
			return console.log(`id-${id} tried to run the den command`);
		}
	}
};