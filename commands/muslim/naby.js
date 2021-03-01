exports.run = async (client, message, args) => {
    let member = message.mentions.members.first();
    if (!member) {
        message.channel.send("عليه الصلاة والسلام");
    } else {
        message.channel.send(`صلي على الحبيب محمد **${member.user.username}**`)
    }

}

exports.help = {
    name: 'naby'
}
exports.conf = {
    aliases: ["نبي", "رسول"]
}