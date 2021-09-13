exports.run = async (client, message, args) => {
    const online = message.guild.members.cache.filter(m =>
        m.presence?.status === 'online'
    ).size
    const idle = message.guild.members.cache.filter(m =>
        m.presence?.status === 'idle'
    ).size
    const dnd = message.guild.members.cache.filter(m =>
        m.presence?.status === 'dnd'
    ).size

    const offline = message.guild.members.cache.filter(m =>
        m.presence?.status === 'offline'
    ).size



    let e = new Discord.MessageEmbed()
        .setColor("#00EB2B")
        .setTitle(`*Members Status`)
        .setDescription(`**
🟢 Online : ${online} 
🟡 Idle : ${idle}
🔴 DND : ${dnd}
⚪ Offline : ${offline}
**`)
        .setTimestamp()
    message.channel.send({ embeds: [e] })
}
exports.help = {
    name: "members-status",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: ["ms"],
    userPermissions: ["MANAGE_GUILD"],
    cooldown: 5
}