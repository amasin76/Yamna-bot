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

        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle("🔀 Shuffled the Queue")
        ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))

        client.distube.shuffle(message);
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
    name: "mix",
    description: "Shuffles the Queue",
    usage: "<prefix>mix",
    example: "~mix"
}
exports.conf = {
    aliases: ["shuffle"],
    cooldown: 5
}  