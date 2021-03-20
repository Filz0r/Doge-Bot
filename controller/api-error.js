const USERS = require('./users');
const GUILDS = require('./guilds');

module.exports.errorHandler = async (error, message, ownerID) => {
    const { logOut } = await GUILDS.checkGuild(message)
    const { id, tag } = message.author;
    const { flags, ignoreFlags } = await USERS.checkUser(id, tag)
    if (error.code === 50007) console.log(`I tried to send a DM to ${id} but has them disabled, probably because they triggered automod`);
    if (error.code === 50013) console.log(`I tried to reply to ${id} but I don't have permissions to write on that channel`);
    if (error.code !== 50013 && error.code !== 50007 && logOut !== 'none') {
        console.log('got here4')
        console.error(error)
        return message.guild.channels.cache
                    .get(logOut)
                    .send(`The user <@${id}> tried to run a command that originated an error I don't know how to handle, please contact <@${ownerID}> and tell him this error: ${error}`);
    }
    if (error.code === 50007 && logOut !== 'none') {
        console.log('got here3')
        return message.guild.channels.cache
                    .get(logOut)
                    .send(`The user <@${id}> has probably triggered automod with DMs disabled stopping me for warning him, please warn him that he has ${flags} block flags and ${ignoreFlags} ignore flags!`);
    }
    if  (error.code === 50013 && logOut !== 'none') {
        console.log('got here2')
        return message.guild.channels.cache
                    .get(logOut)
                    .send(`The user <@${id}> has tried to run a command in a channel I don't have permissions to write on, the channel in cause is <#${message.channel.id}>`);
    }
    const knownErrors = [50007, 50013]
    if (!knownErrors.includes(error.code)) {
        console.log('got here1')
        return console.error(error);
    } else {
        return;
    }
}