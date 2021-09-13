const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { format, createBar } = require("../../handlers/functions")

exports.run = async (client, message, args) => {
    try {
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
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
        let queue = client.distube.getQueue(message);
        let track = queue.songs[0];
        console.log(track.uploader)

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`Now playing :notes: ${track.name}`.substr(0, 128))
                .setURL(track.url)
                .setThumbnail(track.thumbnail)
                .addField("▶ Views", `\`\`\`js\n${track.views}\n\`\`\``, true)
                .addField(":thumbsup: Likes", `\`\`\`js\n${track.likes}\n\`\`\``, true)
                .addField(":thumbsdown: Dislikes", `\`\`\`js\n${track.dislikes}\n\`\`\``, true)
                .addField(":stopwatch: Duration", `\`\`\`js\n${track.formattedDuration}\n\`\`\``, true)
                //.addField(":stopwatch: Source", `\`\`\`js\n${track.source.toLowerCase()}\n\`\`\``, true)
                .addField(":arrows_counterclockwise: Reposts", `\`\`\`js\n${track.reposts}\n\`\`\``, true)
                .addField(":cd: Requested by", `\`\`\`js\n${track.user.username}\n\`\`\``, true)
                .addField(":inbox_tray: Uploader", `[${track.uploader?.name}](${track.uploader?.url})`, true)
                .addField(":pushpin: Download", `[link](${track.streamURL})`, true)
                //.addField("Duration: ", createBar(queue.currentTime))
            ]
        })//.then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))

        message.react("✅").catch(console.error);

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
    name: "trackInfo",
    description: "Shows current Track information",
    usage: "<prefix>np",
    example: "~np"
}
exports.conf = {
    aliases: ["np", "trackinfo", "nowplaying"],
    cooldown: 5
}
