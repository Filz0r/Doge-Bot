const Event = require('../controller/events');
const USER = require('../controller/users');
const GUILD = require('../controller/guilds');
const AUTOMOD = require('../controller/automod');
module.exports = class extends Event {

	async run(message) {
		const mentPrefix = `<@!${this.client.user.id}>`;
		const { id, tag } = message.author;
		if (message.guild === null) return;
		const guilds = await GUILD.checkGuild(message);
		const prefix = this.client.prefix === guilds.prefix ? this.client.prefix : guilds.prefix;


		if(message.content.match(mentPrefix) && message.content.length === mentPrefix.length && this.client.owners.includes(id)) {
			return message.channel.send(`Ya big dummy, its:  \`${prefix}\``);
		} else 	if (message.content.match(mentPrefix) && message.content.length === mentPrefix.length) {
			return message.channel.send(`My prefix for ${message.guild.name} is \`${prefix}\`.`);
		}

		if (!message.content.startsWith(prefix) || !message.guild || message.author.bot) return;

		let users = await USER.checkUser(id, tag);
		users === null ? users = await USER.checkUser(id, tag) : users;

		if (users.ignore === true) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args);
		}
		else {
			const flags = users.flags;
			if (flags >= 0) {
				if (guilds.admins.includes(id) || id === this.client.owners[0]) return;
				const reason = await AUTOMOD.autoModeration(id, tag, message, 0);
				return await AUTOMOD.tellMod(message, id, reason);
			}
		}
	}
};