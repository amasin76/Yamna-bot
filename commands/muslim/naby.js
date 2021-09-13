exports.run = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) {
        message.channel.send("**عليه خير الصلاة والسلام**");
    } else {
        message.channel.send(`| ${member.user.username} | **صلي على الحبيب محمد** |`)
    }

}

exports.help = {
    name: 'naby'
}
exports.conf = {
    aliases: ["نبي", "رسول"]
}