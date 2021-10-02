const { version } = require('../../package.json');
const ms = require('ms');
const { version: discordjsVersion } = require('discord.js');

exports.run = async (client, message, args) => {
    message.channel.send({
        embeds: [new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`MO7MO7 v${version}`)
            .addField('💭 Prefix', `\`\`\`fix\n -\`\`\``, true)
            .addField('🕕 Uptime', `\`\`\`js\n${ms(client.uptime)}\`\`\``, true)
            .addField('🤖 Ping', `\`\`\`js\n${client.ws.ping} ms\`\`\``, true)
            .addField('💾 Memory', `\`\`\`js\n${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS | ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, false)
            .addField('💻 Node', `\`\`\`fix\n${process.version} on ${process.platform} ${process.arch}\`\`\``, false)
            .addField('💾 Cached Data', `\`\`\`js\n${client.users.cache.size} users | ${client.emojis.cache.size} emojis\`\`\``, false)
            .addField('🏠 Guild Count', `\`\`\`js\n${client.guilds.cache.size}\`\`\``, true)
            .addField('💬 Commands', `\`\`\`js\n${client.commands.size}\`\`\``, true)
            .addField('💻 Discord.js', `\`\`\`fix\n${discordjsVersion}\`\`\``, true)
            .setTimestamp()
        ]
    });
}
exports.help = {
    name: 'about',
    description: 'about bot',
    usage: '<prefix>about',
    example: '-'
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}