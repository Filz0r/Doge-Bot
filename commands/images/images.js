const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const IMAGES = require('../../controller/images')


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'images',
			aliases: ['i', 'img'],
			category: 'Images and Memes',
			description: 'Sends a picture to your DMs can be a random or you can request categories!',
            args: true
		});
	}

	async run(message, args) {
		const { id, tag } = message.author;
		const { block } = await USERS.checkUser(id, tag);
		if(!block) {
            if (args.length === 1) {
                return await IMAGES.sendImage(message, args[0].toLowerCase(), id);
            } else if (args.length === 0) {
                return await IMAGES.sendImage(message, 'random', id)
            } else {
                message.reply('you can only provide one argument for this command, or if you provide none I\'ll send a random meme/image to your dms')
            }
		}
		else if(block) {
			const reason = await USER.autoModeration(id, tag, message, 6);
			return await USER.tellMod(message, id, reason);
		}
	}
};