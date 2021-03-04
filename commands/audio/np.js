const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { format, createBar } = require("../../handlers/functions")

exports.run = async (client, message, args) => {
    try {
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
        if (!channel)
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | Please join a Channel first`)
            );
        if (!client.distube.getQueue(message))
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | I am not playing Something`)
                .setDescription(`The Queue is empty`)
            );
        if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | Please join **my** Channel first`)
                .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
            );
        let queue = client.distube.getQueue(message);
        let track = queue.songs[0];

        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`Now playing :notes: ${track.name}`.substr(0, 256))
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .addField("Views", `▶ ${track.views}`, true)
            .addField("Dislikes", `:thumbsdown: ${track.dislikes}`, true)
            .addField("Likes", `:thumbsup: ${track.likes}`, true)
            //.addField("Duration: ", createBar(queue.currentTime))
        )//.then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(config.wrongcolor)
            .setFooter(config.footertext, config.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
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
