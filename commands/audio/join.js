const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { delay } = require("../../handlers/functions");
const { joinVoiceChannel } = require('@discordjs/voice');
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

        joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            debug: true
        })

        setTimeout(() => { if (message.guild.me.voice.channel.id === channel.id) return message.react('✅') }, 1000)

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ | An error occurred`)
                .setDescription(`\`\`\`${e}\`\`\``)
            ]
        });
    }
}
exports.help = {
    name: "join",
    description: "PLays a track from youtube",
    usage: "<prefix>play <URL / TITLE>",
    example: "~p sound effect"
}
exports.conf = {
    aliases: ["p"],
    mePermissions: ["SPEAK", "CONNECT"],
    cooldown: 5
}