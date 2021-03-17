const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const check = require('../../Structures/user.js');


const subreddits = [
	'puppy',
	'doggy',
	'dog',
	'dogs',
	'puppies',
	'dogpics',
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'dog',
			aliases: ['dogs', 'Doge'],
			category: 'Images',
			description: 'Sends a random dog picture to your DM',
		});
	}

	async run(message) {
		const { id, tag } = message.author;
		const USER = await check.checkUser(id, tag);
		if(!USER.block) {
			const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
				.then(response => response.json())
				.then(body => body.data);
			const selected = data[Math.floor(Math.random() * data.length)];
			message.client.users.cache.get(id).send(new MessageEmbed().setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`));
			return message.reply('A picture has been sent to your dm!');
		}
		else if(USER.block) {
			const reason = await USER.autoModeration(id, tag, message, 9);
			await USER.tellMod(message, id, reason);
			return;
		}
	}
};