const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    try {
        const text = args.join(" ")
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
        let mode = client.distube.toggleAutoplay(message);
        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle("Set autoplay mode to `" + (mode ? "On" : "Off") + "`")
        ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))

        //client.distube.stop(message);
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
    name: "autoplay",
    description: "Stops a track",
    usage: "<prefix>stop",
    example: "~stop"
}
exports.conf = {
    aliases: ["autoplay"],
    cooldown: 5
}