const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
// user = message.member test
exports.run = async (client, message, args) => {
    const text = args.join(" ")
    try {
        if (!args[0])
            return message.channel.send(new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | You didn't provided a Searchterm`)
                .setDescription(`Usage: \`${prefix}play <URL / TITLE>\``)
            );
        message.channel.send(new MessageEmbed()
            .setColor(config.color)
            .setFooter(config.footertext, config.footericon)
            .setTitle("Searching Song")
            .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
        );
        client.distube.play(message, text);
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
    name: "play",
    description: "PLays a track from youtube",
    usage: "<prefix>play <URL / TITLE>",
    example: "~p sound effect"
}

exports.conf = {
    aliases: ["p"],
    cooldown: 5
}