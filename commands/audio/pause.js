const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    try {
        const text = args.join(" ")
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
                    .setDescription(`Channel Name: \`${message.guild.me.voice.channel.name}\``)
                ]
            });
        if (queue.paused)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Cannot pause the Song`)
                    .setDescription(`It's already paused, so I cant!`)
                ]
            });
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setTitle("⏸ Paused the Song")
            ]
        }).then(msg => setTimeout(() => msg.delete(), 4000))

        client.distube.pause(message);
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
    name: "pause",
    description: "Pause the track",
    usage: "<prefix>pause",
    example: "~pause"
}
exports.conf = {
    aliases: ["hold"],
    cooldown: 5
}