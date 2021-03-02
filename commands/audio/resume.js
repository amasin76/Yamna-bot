const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { delay } = require("../../handlers/functions")

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
        if (client.distube.isPlaying(message))
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | Cannot resume the Song`)
                .setDescription(`It's not paused, so I cant!`)
            );
        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle("▶ Resumed the Song")
        ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))

        client.distube.resume(message);
        //those 4 lines with the delay, fixes the bug that it doesnt resume by repausing and reresuming ;)
        await delay(100);
        client.distube.pause(message);
        await delay(100);
        client.distube.resume(message);
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
    name: "resume",
    description: "Resumes the track",
    usage: "<prefix>resume",
    example: "~resume"
}
exports.conf = {
    aliases: ["r", "back"],
    cooldown: 5
}