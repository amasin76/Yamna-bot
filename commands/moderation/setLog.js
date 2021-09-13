const db = require("old-wio.db");

exports.run = async (client, message, args) => {
    let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

    const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor('BLACK')
        .setDescription(`:x: **Please enter a valid Text Channel!**`)
        .addField('Example usage: ', '=setlog #log_channel')
    if (!channel || channel.type !== 'GUILD_TEXT') return message.channel.send({ embeds: [embed2] });

    try {
        let a = await db.fetch(`logs_${message.guild.id}`)

        if (channel.id === a) {
            const embed3 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor('BLACK')
                .setDescription(`:x: **This Channel is Already Set As Logger Channel!**`)
            return message.channel.send({ embeds: [embed3] })
        } else {
            client.guilds.cache.get(message.guild.id).channels.cache.get(channel.id);
            db.set(`logs_${message.guild.id}`, channel.id);
            const embed4 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor('BLACK')
                .setDescription(`:white_check_mark:  **Logger Channel Has Been Set Successfully in \`${channel.name}\`!**`)
            message.channel.send({ embeds: [embed4] });
        }
    } catch (err) {
        const embed5 = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor('BLACK')
            .setDescription(`:x: **Error - \`Missing Permissions Or Channel Is Not A Text Channel!\`**`)
        message.channel.send({ embeds: [embed5] });
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