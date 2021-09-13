const welcomeSchema = require("../../models/welcomeSchema");

exports.run = async (client, message, args) => {
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
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 5
}