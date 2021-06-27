exports.run = async (client, message, args) => {

    const role = message.guild.roles.cache?.get(args[0])
        ?? message.mentions.roles.first()
        ?? message.guild.roles.cache.find(role => role.name === args[0]);

    const members = message.guild.members.cache.filter(m => m.roles.cache.get(role.id));

    if (members.size == 0) return message.channel.send("**There are 0 members have this role.**");
    let embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle(`${members.size} • Member(s)`)
        .setDescription(`• ${members.map(m => m.user.username).join("\n• ")}`)
        .setFooter(`Requested By: ${message.author.username}`, message.author.avatarURL)

    message.channel.send(embed);
}
exports.help = {
    name: "check-role",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: ["rcheck"],
    userPermissions: ["MANAGE_GUILD"],
    cooldown: 5
}