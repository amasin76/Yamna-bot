const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { format } = require("../../handlers/functions")

exports.run = async (client, message, args) => {
    try {
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
        const queue = client.distube.getQueue(message.guild.id)
        if (!channel)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Please join a Channel first`)
                ]
            });
        if (!client.distube.getQueue(message))
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | I am not playing Something`)
                    .setDescription(`The Queue is empty`)
                ]
            });
        if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Please join **my** Channel first`)
                    .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
                ]
            });
        if (!args[0])
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | You didn't provided a Time you want to seek to!`)
                    .setDescription(`Usage: \`${config.prefix}seek 10\``)
                ]
            })

        let seektime = Number(args[0]);

        if (seektime < 0)
            seektime = 0;

        if (seektime >= client.distube.getQueue(message).songs[0].duration)
            seektime = client.distube.getQueue(message).songs[0].duration - 1;

        client.distube.seek(message, seektime);
        message.react("✅").catch(console.error);

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setDescription(`⏩ **Seeking to**: \`${queue.formattedCurrentTime}\` || \`${seektime}\`s`)
            ]
        }).then(msg => setTimeout(() => msg.delete(), 10000))

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            ]
        });
    }
}
exports.help = {
    name: "seek",
    description: "Seek to a position in the track <Seconds>",
    usage: "<prefix>seek <Seconds>",
    example: "~seek"
}
exports.conf = {
    aliases: ["seek"],
    cooldown: 5
}