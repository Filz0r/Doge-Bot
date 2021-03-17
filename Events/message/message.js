const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix) || !message.guild || message.author.bot) return;

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args);
		}
	}

};
