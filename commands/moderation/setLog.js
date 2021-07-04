const db = require("old-wio.db");

exports.run = async (client, message, args) => {
    let channel = message.mentions.channels.first() ||
        client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) ||
        message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

    const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor('BLACK')
        .setFooter(client.user.username, client.user.avatarURL())
        .setDescription(`:x: **Please enter a valid Text Channel!**`)
        .addField('Example usage: ', 'm!setlogschannel #logs')
        .setTimestamp();
    if (!channel || channel.type !== 'text') return message.channel.send(embed2);

    try {
        let a = await db.fetch(`logs_${message.guild.id}`)

        if (channel.id === a) {
            const embed3 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor('BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription(`:x: **This Channel is Already Set As Logger Channel!**`)
                .setTimestamp();
            return message.channel.send(embed3)
        } else {
            client.guilds.cache.get(message.guild.id).channels.cache.get(channel.id);
            db.set(`logs_${message.guild.id}`, channel.id);
            const embed4 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor('BLACK')
                .setFooter(client.user.username, client.user.avatarURL())
                .setDescription(`:white_check_mark:  **Logger Channel Has Been Set Successfully in \`${channel.name}\`!**`)
                .setTimestamp();
            message.channel.send(embed4);
        }
    } catch (err) {
        const embed5 = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor('BLACK')
            .setFooter(client.user.username, client.user.avatarURL())
            .setDescription(`:x: **Error - \`Missing Permissions Or Channel Is Not A Text Channel!\`**`)
            .setTimestamp();
        message.channel.send(embed5);
        return console.log(err);
    }
}
exports.help = {
    name: 'setlog',
    description: 'Set Logger Channel',
    usage: '<prefix>setlog <channel>',
    example: '=setlog #logs'
}
exports.conf = {
    aliases: [],
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 10
}