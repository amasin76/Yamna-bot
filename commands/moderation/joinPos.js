
exports.run = async (client, message, args) => {
    const member = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

    if (!member) return message.reply("Please specify a member!");

    let members = Array.from(message.guild.members.cache
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp))

    let position = ''

    for (let i = 1; i < members.length + 1; i++) {
        if (members[i - 1]?.[0] === member.id) position += `${i}`;
    }

    message.channel.send(`**${member.user.username}** is the ${position} place member to join the server!`);

}
exports.help = {
    name: 'position',
    description: '',
    usage: '<prefix>pos <member>',
    example: '-pos @dev'
}
exports.conf = {
    aliases: ['pos'],
    userPermissions: ['MANAGE_GUILD'],
    cooldown: 5
}