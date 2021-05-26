exports.run = async (client, message, args) => {
    const emojis = message.guild.emojis.cache
    const animated = emojis.filter(emoji => emoji.animated)
    const regular = emojis.filter(emoji => !emoji.animated)

    const Embed = new Discord.MessageEmbed()
        .setTitle(`Emojis in ${message.guild.name} | Emojis [${emojis.size}]`)
        .addFields(
            {
                name: `Animated [${animated.size}]:`,
                value: animated.size > 0 ? animated.join(' ') : 'N/A'
            },
            {
                name: `Standard [${regular.size}]:`,
                value: regular.size > 0 ? regular.join(' ') : 'N/A'
            })
    message.channel.send(Embed);
}

exports.help = {
    name: "emojis",
    description: "Shows all the emojis available in the server",
    usage: "<prefix>emojis",
    example: "=emojis"
}
exports.conf = {
    aliases: [],
    cooldown: 5
}