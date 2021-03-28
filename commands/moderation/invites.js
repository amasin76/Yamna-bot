const discord = require('discord.js')

exports.run = async (client, message, args) => {
    let user = message.mentions.users.first() || message.author
    let invites = await message.guild.fetchInvites();
    let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

    if (userInv.size <= 0) {
        return message.channel.send(`${user.username} don't have any invites`)
    }

    let invCodes = userInv.map(x => x.code).join('\n')
    let i = 0;
    userInv.forEach(inv => i += inv.uses)

    const embed = new discord.MessageEmbed()
        .setTitle(`\`=-=-=-= ${user.username} Invites =-=-=-=\``)
        .setAuthor('INFO / ALL INVITES', `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setThumbnail('https://img.icons8.com/plasticine/2x/invite.png')
        //.addField('User Invites', i)
        //.addField('Invite Codes', invCodes)
        .addFields(
            {
                name: "💚User Invites: ",
                value: i,
                inline: true
            },
            {
                name: "🔑Invite Codes: ",
                value: invCodes,
                inline: true
            })
        .setColor('GREEN')
        .setTimestamp()
    message.channel.send(embed)
}
exports.help = {
    name: "invites",
    description: "Get all user invitations make in the server.",
    usage: "<prefix>inv @user",
    example: "=inv @Ali"
}
exports.conf = {
    aliases: ["inv"],
    cooldown: 5
}