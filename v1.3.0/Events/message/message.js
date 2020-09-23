const Event = require('../../Structures/Event');
const USER = require('../../Structures/user');
const GUILD = require('../../Structures/guilds');
module.exports = class extends Event {

	async run(message) {
		const mentPrefix = `<@!${this.client.user.id}>`;
		const { id, tag } = message.author;
		if (message.guild === null) return;
		const guilds = await GUILD.checkGuild(message);
		const prefix = guilds.prefix ? guilds.prefix : message.content.startsWith(mentPrefix) ? mentPrefix : this.client.prefix ;
		if (!message.content.startsWith(prefix) || !message.guild || message.author.bot) return;

		let users = await USER.checkUser(id, tag);

		users === null ? users = await USER.checkUser(id, tag) : users;
		if (users.ignore === true) return;
		if (message.content.match(mentPrefix) && message.content.length === mentPrefix.length) return message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args);
		}
		else {
			const flags = users.flags;
			if (flags >= 5) return await USER.autoModeration(id, tag, message);
			else await USER.flagUser(id);
			return message.reply(`invalid command! Use \`${this.client.prefix}help\` to see my valid commands!\nIf you keep trying to use non existing commands I might end up ignoring you! :angry:`);
		}
	}
};