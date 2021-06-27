exports.run = async (client, message, args) => {

    try {
        if (message.member.voice.channelID == null) return message.channel.send({ embed: { "description": "❕ You Have To Be In Room Voice", "color": "YELLOW" } }).then(msg => msg.delete({ timeout: 15000 }))
        let author = message.member.voice.channelID;
        console.log(author)

        message.guild.members.cache.filter(m => m.voice.channel).forEach(m => m.voice.setChannel(author))

        message.channel.send(`**:white_check_mark: Success Moved All To Your Channel**`)
    } catch (err) {
        console.error(err.message || err)
    }

}
exports.help = {
    name: "move-all",
    description: "Move all connected server members to your voice channel",
    usage: "<prefix>mvall",
    example: "=mvall"
}
exports.conf = {
    aliases: ["mvall"],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 120
}