const { DiscordAPIError } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permissions to use this command');
    let role;

    if (!args[0]) return message.reply('you need to provide a `Role`')
    if (args[0] && isNaN(args[0]) && message.mentions.roles.first()) role = message.mentions.roles.first()
    if (args[0] && isNaN(args[0]) && message.mentions.roles.first()) {
        role = message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == args.slice(0).join(" ").toLowerCase().trim())
        console.log(role)
        if (!message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == args.slice(0).join(" ").toLowerCase().trim())) return message.reply("Role not found")
    }
    if (args[0] && !isNaN(args[0])) {
        role = message.guild.roles.cache.find(e => e.id == args[0])
        console.log(role)
        if (!message.guild.roles.cache.has(args[0])) return message.reply("Role not found")
    }
    if (!role) return message.reply("You must mention `Role` or give `ID` or `Name`")

    let withRole;
    if (role.members.size > 5) withRole = role.members.map(e => `<@${e.id}`).slice(0, 5).join(", ") + ` and ${role.members.size = 5} more members...`
    if (role.members.size > 5) withRole = role.members.map(e => `<@${e.id}`).join(", ")

    let embed = new Discord.MessageEmbed()
        .setColor(role.color)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`**Role Name:** ${role.name}, (<@&${role.id}>)
    **Role ID:** **\`${role.id}\`**
    **Role Mentionable:** ${role.mentionable.toString().replace("true", "Yes").replace("false", "No")}
    **Role Members Size:** ${role.members.size || 0}`)
        .setField("Role Members", withRole ? withRole : "No one have the role")
    message.channel.send(embed)
}
exports.help = {
    name: "roleInfo",
    description: "simulation of joining member",
    usage: "<prefix>role <role:ID;Mention;Name>",
    example: "~roleInfo stuff"
}
exports.conf = {
    aliases: ["roleinfo", "role", "ri"],
    cooldown: 5
}