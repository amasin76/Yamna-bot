const welcomeSchema = require("../../models/welcomeSchema");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command');
    const { guild, channel } = message

    await welcomeSchema.findOneAndUpdate({
        _id: guild.id
    }, {
        _id: guild.id,
        channelID: channel.id
    }, {
        upsert: true
    })
    message.channel.send('Welcome channel set!')
}
exports.help = {
    name: "setwelcome",
    description: "set welcome channel",
    usage: "<prefix>setwelcome <channel>",
    example: "~setwelcome #welcome"
}
exports.conf = {
    aliases: ["welcome"],
    cooldown: 5
}