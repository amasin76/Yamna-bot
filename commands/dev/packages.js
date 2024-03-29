const { MessageEmbed } = require("discord.js");
const pkg = require("../../package.json");

exports.run = async (client, message, args) => {
    const dependencies = Object.entries(pkg.dependencies).join(",\n");

    const embed = new MessageEmbed()
        .setTitle("All Dependencies")
        .setDescription(dependencies)
        .setTimestamp()
        .setFooter(message.author.username);

    message.channel.send({ embeds: [embed] });
}

exports.help = {
    name: "packages",
    description: "Shows a list of all bots dependencie",
    usage: "<prefix>packages",
    example: "=packages"
}

exports.conf = {
    aliases: ["pck"],
    cooldown: 10
}