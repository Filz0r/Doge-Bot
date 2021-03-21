const Command = require('../../controller/commands');
const USERS = require('../../controller/users');
const IMAGES = require('../../controller/images')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'dank',
			category: 'Images and Memes',
			description: 'Sends a random dank meme to your DMs!',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const { block } = await USERS.checkUser(id, tag);
		if(!block) {
            return await IMAGES.sendImage(message, 'dank', id);
		}
		else if(block) {
			const reason = await USER.autoModeration(id, tag, message, 6);
			return await USER.tellMod(message, id, reason);
		}
	}
};