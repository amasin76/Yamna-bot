const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { humanize_format } = require("../../handlers/functions")

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.me.voice.channel) return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | Nothing playing!`)
            ]
        }); //functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | ${message.author.tag} You must join a Voice Channel`)
            ]
        }); //functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | ${message.author.tag} You must join my Voice Channel: \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
            ]
        }); //functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //if no args return error
        if (!args[0]) return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | ${message.author.tag} Please add the Position to which you want to jump to`)
            ]
        }); //functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add the Position to which you want to jump to")

        //get queue
        let queue = client.distube.getQueue(message);

        //if no queue return error
        if (!queue) return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | There is nothing playing!`)
            ]
        }); //functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        if (0 < Number(args[0]) && Number(args[0]) <= queue.songs.length) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    //.setFooter(config.footertext, config.footericon)
                    .setDescription(`:arrow_right_hook: Jumped to \`${humanize_format(+args[0])}\` song!`)
                ]
            }); //functions.embedbuilder(client, 3000, message, config.colors.yes, "SUCCESS", `Jumped ${parseInt(args[0])} songs!`)
            message.react("✅").catch(console.error);
            return client.distube.jump(message, parseInt(args[0] - 1))
                .catch(err => message.channel.send({ content: "Invalid song number." }));
        } else {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    //.setFooter(config.footertext, config.footericon)
                    .setDescription(`❌ ERROR | Please use a number between **1** and **${client.distube.getQueue(message).length}**`)
                ]
            }); //functions.embedbuilder(client, 3000, message, config.colors.no, "ERROR", `Please use a number between **0** and **${DisTube.getQueue(message).length}**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                //.setFooter(config.footertext, config.footericon)
                .setDescription(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            ]
        });
    }
}

exports.help = {
    name: "jump",
    description: "Shuffles the Queue",
    usage: "<prefix>mix",
    example: "~mix"
}
exports.conf = {
    aliases: ["skip-to", "skipto"],
    cooldown: 5
}