const { secondsToTime } = require('../../handlers/functions')

exports.run = async (client, message, args, prefix) => {
    target = message.guild.members.cache?.get(args[0])
        ?? message.mentions.users.first()
        ?? message.guild.members.cache.find(user => user.name === args[0])
        ?? message.author;
    if ((target.id !== message.author.id) && message.member.permissions.has('MOVE_MEMBERS')) {
        message.channel.send('You can check only your join-age')
    }

    const embed = new Discord.MessageEmbed()
        //.setTitle(`**${title}**`)
        //.setColor(color)
        .addField('Expires At :', `\`\`\`js\n${Intl.DateTimeFormat('en-GB', { /*weekday: 'long',*/ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'UTC' }).format(target.joinedAt)}\n\`\`\``, false)
        .addField('Join Duration :', `\`\`\`js\n${secondsToTime((Date.now() - target.joinedTimestamp) / 1000)?.[0]}\n\`\`\``, false)

    message.channel.send({ embeds: [embed] }).catch(err => console.log(err))
}
exports.help = {
    name: 'join-age',
    description: 'Get joined server date and duration',
    usage: '<prefix>join',
    example: '='
}
exports.conf = {
    aliases: ['joinage', 'joined'],
    userPermissions: [],
    cooldown: 5
}