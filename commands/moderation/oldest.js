
const { format } = require("../../handlers/functions");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
    let mem = message.guild.members.cache
        .filter((m) => !m.user.bot)
        .sort((a, b) => a.user.createdAt - b.user.createdAt)
        .first();
    const Embed = new MessageEmbed()
        .setTitle(`The oldest member in ${message.guild.name}`)
        .setColor(`RANDOM`)
        .setFooter(`Date format: MM/DD/YYYY`)
        .setDescription(
            `${mem.user.tag} is the oldest user in ${message.guild.name
            }! Account creation date: ${mem.user.createdAt}`
        );
    message.channel.send({ embeds: [Embed] });
}
exports.help = {
    name: 'old',
    description: '',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}