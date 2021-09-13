const { DiscordAPIError } = require("discord.js");

exports.run = async (client, message, args) => {
    try {
        var r = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!r) return message.channel.send(`**Mention A Role |OR| Provide A Role ID**`).then(msg => setTimeout(() => msg.delete(), 25000));


        var embed = new Discord.MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()
            .setTitle(`${r.name} Info`)
            .setColor(r.hexColor)
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField('Server Name : ', message.guild.name)
            .addField('Role Name : ', r.name)
            .addField('Role Id : ', r.id.toString())
            .addField('Role Created At : ', `${r.createdAt}`)
            .addField(`Role Members (${Array.from(r.members).length}) : `, `${r.members.map(member => `\`${member.user.username}\``).join(" | ")}`)
            .addField('Role Color : ', r.hexColor.toString())
        message.channel.send({ embeds: [embed] })
    } catch (err) {
        console.log(err)
    }
}
exports.help = {
    name: "roleInfo",
    description: "simulation of joining member",
    usage: "<prefix>role <role:ID;Mention;Name>",
    example: "~roleInfo stuff"
}
exports.conf = {
    aliases: ["roleinfo", "role", "ri"],
    userPermissions: ["MANAGE_GUILD"],
    cooldown: 5
}