const userSchema = require('../models/users');
const GUILD = require('../controller/guilds');
const USER = require('../controller/users')

// This is the function that flags and blocks users automatically
module.exports.autoModeration = async (id, tag, message, reason) => {
	// Array that is used to build the reasons for bot warns
	const reasons = {
		0: 'trying to use non existing commands',
		1: 'trying to change the status of the bot (Bot owner only command)',
		2: 'trying to block users from using me (Server Admin only command)',
		3: 'trying to change my prefix for this server (Server Admin only command)',
		4: 'trying to change the Raid dens information (Bot owner only command)',
		5: 'trying to kill me (Bot owner only command)',
		6: 'trying to use the bot after being blocked',
		7: 'trying to change/set the log output channel (Server Admin only command)'

	};
	let { block, flags, ignoreFlags } = await USER.checkUser(id, tag);
	const { name } = message.guild;
	// Really trying to make sure no one breaks this system
	if (flags < 0) return console.log(`ERROR: user ${tag} has invalid flags: ${flags}`);
	if (flags > 10) return console.log(`ERROR: user ${tag} has invalid flags ${flags}`);
	if (ignoreFlags < 0) return console.log(`ERROR: user ${tag} has invalid flags: ${flags}`);
	if (ignoreFlags > 10) return console.log(`ERROR: user ${tag} has invalid flags ${flags}`);
	// If the user has only been flagged from 0 to 9 times add a flag
	if (flags >= 0 && flags <= 9 && !block) {
		flags++;
		await userSchema.findOneAndUpdate({ _id: id }, { flags });
		// If he has 10 flags
		if (flags === 10) {
			// Tell the user he was blocked from using commands
			await userSchema.findOneAndUpdate({ _id: id }, { block: true });
			console.log(`user ${tag} was blocked for having to many flags!`);
			return message.reply('you are now blocked from using me!');
		}
		else {
			// Otherwise it sends a DM to the user telling why they were flagged and returns the reason why he got flagged to use
			// in the tellMod function
			console.log(`${tag} was flagged for ${reasons[reason]} on ${name}, total flags : ${flags}`);
			message.client.users.cache.get(id).send(`You were flaged for: \`${reasons[reason]}\`\n\`Current flags: ${flags}/10\``);
			return reasons[reason];
		}
	}
	else if (block) {
		ignoreFlags++;
		await userSchema.findOneAndUpdate({ _id: id }, { ignoreFlags: ignoreFlags });
		if (ignoreFlags >= 10) {
			await userSchema.findOneAndUpdate({ _id: id }, { ignore: true });
			console.log(`user ${tag} is now going to be ignored!`);
			return message.reply('congratulations, from now on I will completely ignore your commands!');
		}
		else {
			console.log(`${tag}, is working his way up to me ignoring him ${ignoreFlags}`);
			return message.reply(`I already blocked you, if you keep trying I'll start ignoring you!\n\`Flags:${ignoreFlags}/10\``);
		}
	}
};

module.exports.tellMod = async (message, id, reason) => {
	// Finds if there is a set channel to output bot reports
	const { logOut } = await GUILD.checkGuild(message);
	// If there is it sends a report there
	if (logOut !== 'none') {
		message.guild.channels.cache.get(logOut).send(`The user <@${id}> was flagged for \`${reason}\``);
		return;
	} else {
		// Then it finds out if there is anyone with the permission to ban members in the server that is online
		const activeAdmin = message.guild.members.cache.filter(member => member.permissions.has('BAN_MEMBERS') && member.presence.status !== 'offline' && member.user.bot === false)
			.map(member => member.user.id);
		const noAdmin = activeAdmin.length === 0;
		// If no online admins it pings the server owner
		if (noAdmin) {
			message.channel.send(`<@${message.guild.ownerID}> the user <@${id}> was flagged for \`${reason}\`\nThere were no mods online he did this so I am reporting to you`);
			return;
		}
		// If there are any admins online it picks a random one and reports to them
		else {
			const i = Math.floor(Math.random() * activeAdmin.length);
			message.channel.send(`<@${activeAdmin[i]}> the user <@${id}> was flagged for \`${reason}\``);
			return;
		}
	}
};