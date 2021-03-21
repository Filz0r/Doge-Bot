const Event = require('../controller/events');
const USER = require('../controller/users');
const GUILD = require('../controller/guilds');
const AUTOMOD = require('../controller/automod');
const ERRORS = require('../controller/api-error');
module.exports = class extends Event {

	async run(message) {
		// This function is built to handle errors and bugs that are generated by the Discord
		// API and by node JS, must not forget to edit that function when proper logging is implemented
		// Since I need the message object to debug the errors to me and to the person that caused such error.
		
		// for some reason the bot tries to send a DM to itself when someone has DMs disabled and triggers
		// automod the if statement bellow is sort of a dirty fix to that issue
		// I added it because this was making the error handler go crazy when a user trigered automod with DMS disabled
		// MUST BE THE FIRST STATEMENT IN THIS EVENT DON'T FORGET THE BOT LISTENS TO ALL MESSAGES!
		if (message.author.id === this.client.user.id) return 
		// If you are trying to debug errors please uncoment the console.error statement
		process.on('unhandledRejection',async (error) => {
    		//console.error('Unhandled promise rejection:', error);
    		return await ERRORS.errorHandler(error, message, this.client.owners[0]);
		});

		const mentPrefix = `<@!${this.client.user.id}>`;
		const { id, tag } = message.author;
		if (!message.guild) return;
		const guilds = await GUILD.checkGuild(message);
		const prefix = this.client.prefix === guilds.prefix ? this.client.prefix : guilds.prefix;

		// Allows the bot to be mentioned in order to find out the server prefix
		if(message.content.match(mentPrefix) && message.content.length === mentPrefix.length && this.client.owners.includes(id)) {
			return message.channel.send(`Ya big dummy, its:  \`${prefix}\``).catch(async error => {
				return await ERRORS.errorHandler(error, message, this.client.owners[0]);
			});

		} else 	if (message.content.match(mentPrefix) && message.content.length === mentPrefix.length) {
			return message.channel.send(`My prefix for ${message.guild.name} is \`${prefix}\`.`).catch(async error => {
				return await ERRORS.errorHandler(error, message, this.client.owners[0]);
			});
		}
		// Return if the message does not start with the prefix, comes from a bot or is not sent inside a Guild
		if (!message.content.startsWith(prefix) || !message.guild || message.author.bot) return;
		//	really making sure that the bot gets user info before proceding.
		let users = await USER.checkUser(id, tag);
		users === null ? users = await USER.checkUser(id, tag) : users;
		// If the user has triggered the ignore flag, ignore him and return.
		if (users.ignore === true) return;
		// command handler
		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			command.run(message, args);
		}
		// flags users for using non existing commands.
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