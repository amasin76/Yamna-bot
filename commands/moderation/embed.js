const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('MANNAGE_MESSAGES')) return; // if the member does not have permissions to mannage messages, return/stop reading the code.
    let title = args[0] // args[0] is the first word or number after the command name
    let color = args[1]
    let description = args.slice(2).join(" ") // args.slice(2).join(" ") means we're taking all the arguments including and after the second argument. An argument is just a word or number.
    const error = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('**❌ERROR INVALID ARGS**')
        .setDescription('`=embed title(one word) color(hex code or basic colors in caps i.e(YELLOW) description(embed body)`')

    if (!title || !color || !description) return message.channel.send({ embeds: [error] }) // ! means no, so if there's no title, return and send the error embed


    const embed = new Discord.MessageEmbed()
        .setTitle(`**${title}**`)
        .setColor(color)
        .setDescription(description)
        .setFooter(`Author: ${message.author.username}`)
    message.delete() // this deletes the command

    return message.channel.send({ embeds: [embed] });
}
exports.help = {
    name: 'embed',
    description: '',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}