const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
// user = message.member
exports.run = async (client, message, args) => {
    try {
        const text = args.join(" ")
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
        if (!channel)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | Please join a Channel first`)
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
                    .setTitle(`❌ ERROR | You didn't provided a Search term`)
                    .setDescription(`Usage: \`${config.prefix}play <URL / TITLE>\``)
                ]
            });
        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color)
                .setFooter(config.footertext, config.footericon)
                .setTitle("Searching Song")
                .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
            ]
        }).then(msg => setTimeout(() => msg.delete(), 3000))

        client.distube.play(message, text);

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
    name: "play",
    description: "PLays a track from youtube",
    usage: "<prefix>play <URL / TITLE>",
    example: "~p sound effect"
}
exports.conf = {
    aliases: ["p"],
    cooldown: 5
}