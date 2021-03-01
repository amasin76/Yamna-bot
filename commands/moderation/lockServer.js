const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command')

    const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');

    if (args[0] === 'on') {
        channels.forEach(channel => {
            channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(() => {
                channel.setName(channel.name += `🔒`)
            })
        })
        return message.channel.send('locked all channels');
    } else if (args[0] === 'off') {
        channels.forEach(channel => {
            channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: true
            }).then(() => {
                channel.setName(channel.name.replace('🔒', ''))
            }
            )
        })
        return message.channel.send('unlocked all channels')
    }
}
exports.help = {
    name: "lock+",
    description: " temp mute a user",
    usage: "tmute @user <time>",
    example: "~tmute @sam 1h"
}

exports.conf = {
    aliases: ["lock"],
    cooldown: 5
}