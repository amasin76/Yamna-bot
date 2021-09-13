exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel)
        return message.channel.send("You Are Not In a Voice Channel!")
    try {
        await voiceChannel.join().then(connection => {
            connection.voice.setSelfDeaf(true)
        })
    } catch (error) {
        return message.channel.send(`There Was An Error Connecting To The Voice Channel: ${error}`)
    }
}
exports.help = {
    name: 'join',
    description: '--',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: ['j'],
    userPermissions: [],
    cooldown: 5
}