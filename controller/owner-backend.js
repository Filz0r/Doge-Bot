const guildSchema = require('../models/guilds');
const { version } = require('../package.json');
const { MessageEmbed } = require('discord.js');
module.exports.updateNotice = async (message) => {
    const all = await guildSchema.find()
    const logOutArr = []
    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor || 'BLUE')
    .addField('New Update!', `**DogeBot v${version} is now online!**`)
    .addField('Changelog:', 'https://github.com/Filz0r/Doge-Bot/blob/development/changelog.md');
    for(guild in all) {
        if (all[guild].logOut !== 'none') {
        logOutArr.push(all[guild].logOut)
        }
    }
    for (channel in logOutArr) {
        const channelToSend = await message.client.channels.cache.get(logOutArr[channel])
        channelToSend.send(embed)
    }
}
