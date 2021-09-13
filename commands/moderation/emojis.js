exports.run = async (client, message, args) => {
    const emojis = message.guild.emojis.cache
    const animated = emojis.filter(emoji => emoji.animated)
    const regular = emojis.filter(emoji => !emoji.animated)
    const animatedName = emojis.map(emoji => ':' + emoji.name + ':')
    const regularName = emojis.map(emoji => ':' + emoji.name + ':')

    message.channel.send(`
    __Animated__ ${animated.size}\n
    => ${animated.size > 0 ? animatedName.join(' ') : 'N/A'}\n
    __Standard__ ${regular.size}
    => ${regular.size > 0 ? regularName.join(' ') : 'N/A'}`);
}

exports.help = {
    name: "emojis",
    description: "Shows all the emojis available in the server",
    usage: "<prefix>emojis",
    example: "=emojis"
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}