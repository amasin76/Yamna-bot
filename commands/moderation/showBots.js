const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {
    const botsSize = message.guild.members.cache.filter(m => m.user.bot).map(m => `<@${m.id}> [ ${m.user.username} ]`);
    const x = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${botsSize.join('\n \━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\ \n')}`)
        .setFooter(`Total Bots : ${message.guild.members.cache.filter(member => member.user.bot).size}`)
    message.channel.send({ embeds: [x] })
}
exports.help = {
    name: "showBots",
    description: "See the total number of bots in a server",
    usage: "<prefix>ls",
    example: "=ls"
}
exports.conf = {
    aliases: ["showbots", "ls"],
    userPermissions: ["MANAGE_GUILD"],
    cooldown: 5
}