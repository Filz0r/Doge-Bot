const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const check = require('../../Structures/user.js');


const subreddits = [
	'memes',
	'DeepFriedMemes',
	'bonehurtingjuice',
	'surrealmemes',
	'dankmemes',
	'meirl',
	'me_irl',
	'funny',
	'Doge',
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'meme',
			aliases: ['memes'],
			category: 'Images',
			description: 'Sends a random meme to your DM',
		});
	}

	async run(message) {
		const { id, username } = message.author;
		await check.checkUser(id, username);
		const blockCheck = await check.blockCheck(id);
		let flag = 0;
		if(blockCheck === false) {
			const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
				.then(response => response.json())
				.then(body => body.data);
			const selected = data[Math.floor(Math.random() * data.length)];
			message.client.users.cache.get(id).send(new MessageEmbed().setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`));
			return message.reply('A picture has been sent to your dm!');
		}
		else if(blockCheck === true) {
			message.reply('you are blocked from using me!');
			return flag++;
		}
		if(flag > 3) {
			message.client.users.cache.get(this.client.owners[0]).send('Master this user tried to use me after being blocked! <@' + id + '>');
			return message.channel.send('<@' + this.client.admin[0] + '> a user has been blocked and is still trying to use me!\n the user is: <@' + id + '>');
		}
	}
};