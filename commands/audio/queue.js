const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

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
        if (!queue)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | I am not playing Something`)
                    .setDescription(`The Queue is empty`)
                ]
            });

        let embed = new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`Queue for: ${message.guild.name}`)

        let counter = 0, copy = [];
        for (let i = 0; i < queue.songs.length; i += 20) {
            if (counter >= 10) break;
            let k = queue.songs;
            let songs = k.slice(i, i + 20);
            copy = songs.map((song, index) => ` I **${index + 1 + counter * 20}** I [${song.name}](${song.url}) I \`${song.formattedDuration}\` `)
            //console.log(copy)
            //embed.addField("Queue", copy)
            counter++;
        }
        message.channel.send({ embeds: [embed.setDescription(copy.join("\n"))] })


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
    name: "queue",
    description: "Shows the current queue",
    usage: "<prefix>queue",
    example: "~queue"
}
exports.conf = {
    aliases: ["playlist"],
    cooldown: 5
}