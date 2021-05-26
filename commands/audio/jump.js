const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //if no args return error
        if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add the Position to which you want to jump to")

        //get queue
        let queue = client.distube.getQueue(message);

        //if no queue return error
        if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        if (0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length) {
            functions.embedbuilder(client, 3000, message, config.colors.yes, "SUCCESS", `Jumped ${parseInt(args[0])} songs!`)
            return client.distube.jump(message, parseInt(args[0]))
                .catch(err => message.channel.send("Invalid song number."));
        } else {
            return functions.embedbuilder(client, 3000, message, config.colors.no, "ERROR", `Please use a number between **0** and **${DisTube.getQueue(message).length}**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }
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