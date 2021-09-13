const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const listData = require("../../playlists.json");
const { shuffle, getKeyByValue } = require("../../handlers/functions")
//const listData = require("../../models/playListSchema");

// user = message.member
exports.run = async (client, message, args) => {
    let playlist = await listData?.[`${message.author.id}`]?.playlists?.[0]
    try {
        /*if (args[0] === 'set') {
            await listData.findOneAndUpdate({
                _id: message.author.id
            }, {
                _id: message.author.id,
                listName: args[1] 
            }, {
                upsert: true
            })
        }*/

        const text = args.join(" ")
        const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
        if (!channel)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ | Please join a Channel first`)
                ]
            });
        if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ | Please join **my** Channel first`)
                    .setDescription(`Channelname: \`${message.guild.me.voice.channel.name}\``)
                ]
            });
        /*if (!args[0])
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | You didn't provided a playlist name`)
                    .setDescription(`Usage: \`${config.prefix}playlist <playlist name>\``)
                ]
            });
        if (args[0]) {
            switch (args[0].toLowerCase()) {
                case "bio":
                    return client.distube.playCustomPlaylist(message, shuffle(bio), {
                        name: "Bio"
                    });
                    break;
                default:
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setTitle(`❌ ERROR | Unavailable Playlists:`)
                            .setDescription(`Command Syntax: \`${config.prefix}playlist <playlist name>\``)
                        ]
                    });
                    break;
            }
        }*/
        if (!playlist) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ | Unavailable Playlist(s):`)
                    .setDescription(`You don't have any playlist in the Database`)
                ]
            });
        }
        if (playlist) {
            return client.distube.playCustomPlaylist(message, shuffle(playlist), {
                name: `${listData?.[`${message.author.id}`]?.user}`
            });
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            ]
        });
    }
}
exports.help = {
    name: "playlist",
    description: "PLays a track from youtube",
    usage: "<prefix>play <URL / TITLE>",
    example: "~p sound effect"
}
exports.conf = {
    aliases: ["pl"],
    cooldown: 5
}