const Event = require('../../Structures/Event');
const user = require('../../Structures/user');

module.exports = class extends Event {

	async run(message) {
		const mentPrefix = `<@!${this.client.user.id}>`;
		const { id, username } = message.author;
		const prefix = message.content.startsWith(mentPrefix) ? mentPrefix : this.client.prefix;
		if (!message.content.startsWith(prefix) || !message.guild || message.author.bot) return;

		let users = await user.checkUser(id, username);

		users === null ? users = await user.checkUser(id, username) : users;
		if (users.block === true) return;
		if (message.content.match(mentPrefix) && message.content.length === mentPrefix.length) return message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args);
		}
		else {
			const flags = users.flags;
			if (flags >= 1) {
				console.log(id, username, message.content);
				await user.autoModeration(id, username, message);
			}
			else {
				await user.flagUser(id);
				return message.reply(`invalid command! Use \`${this.client.prefix}help\` to see my valid commands!\nIf you keep trying to use non existing commands I might end up ignoring you! :angry:`);
			}
		}
	}
};