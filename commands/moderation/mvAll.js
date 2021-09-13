exports.run = async (client, message, args) => {

    try {
        if (message.member.voice.channelID == null) return message.reply({ content: '❕ You Have To Be In Room Voice', allowedMentions: { repliedUser: false } })
        let author = message.member.voice.channelId;
        console.log(author)

        //message.guild.members.cache.filter(m => console.log(m.voice.channel))

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