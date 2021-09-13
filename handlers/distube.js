const DisTube = require("distube");
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const config = require("../config.json");
const { format } = require("../handlers/functions")
module.exports = (client) => {

    client.distube = new DisTube.default(client, {
        emitNewSongOnly: true,
        searchSongs: 1,
        searchCooldown: 10,
        leaveOnEmpty: true,
        emptyCooldown: 10,
        leaveOnFinish: true,
        leaveOnStop: true,
        updateYouTubeDL: false,
        plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
        //leaveOnEmpty: false
    })

    // Queue status template
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // DisTube event listeners, more in the documentation page
    client.distube
        /*.on("playSong", (queue, song) => queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle("Playing :notes: " + song.name)
                .setURL(song.url)
                .setColor(config.color)
                .addField("Duration", `\`${song.formattedDuration}\``)
                .addField("QueueStatus", status(queue))
                .setThumbnail(song.thumbnail)
                .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
            ]
        })
        )*/
        .on("addSong", (queue, song) => {
            queue.textChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle("Added :thumbsup: " + song.name)
                    .setURL(song.url)
                    .setColor(config.color)
                    .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration * 1000)}\``)
                    .addField("Duration", `\`${song.formattedDuration}\``)
                    .setThumbnail(song.thumbnail)
                    .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
                ]
            })
        }
        )
        .on("playList", (queue, playlist, song) => queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle("Playing Playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
                .setURL(playlist.url)
                .setColor(config.color)
                .addField("Current Track: ", `[${song.name}](${song.url})`)
                .addField("Duration", `\`${playlist.formattedDuration}\``)
                .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration * 1000)}\``)
                .setThumbnail(playlist.thumbnail.url)
                .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
            ]
        })
        )
        .on("addList", (queue, playlist) => queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`:clipboard: Added Playlist:  \`${playlist.name} - ${playlist.source.toUpperCase()}\``)
                .setURL(playlist.url)
                .setColor(config.color)
                .addField("Duration", `\`\`\`js\n${playlist.formattedDuration}\n\`\`\``, true)
                .addField(`Queue Length`, `\`\`\`js\n${queue.songs.length} Tracks\n\`\`\``, true)
                //.setThumbnail(playlist.thumbnail)
                .setFooter(`Requested by: ${playlist.user.tag}`, playlist.user.displayAvatarURL({ dynamic: true }))
            ]
        })
        )
        .on("searchResult", (message, result) =>
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle("**Choose an option from below**")
                    .setURL(song.url)
                    .setColor(config.color)
                    .setDescription(`${result.map((song, i) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n\n*Enter anything else or wait 60 seconds to cancel*`)
                    .setFooter(config.footertext, config.footericon)
                ]
            })
        )
        .on("searchCancel", (message) => message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setColor(config.wrongcolor)
                .setFooter(config.footertext, config.footericon)
                .setTitle(`❌ ERROR | Search Cancelled`)
            ]
        })
        )
        .on("empty", queue => queue.textChannel.send({
            embeds: [new Discord.MessageEmbed().setDescription("You leave me Alone! Channel is empty")]
        }).then(msg => setTimeout(() => msg.delete(), 5000)))
        .on("error", (channel, e) => {
            console.log(String(e.stack).bgRed)
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(config.wrongcolor)
                    .setFooter(config.footertext, config.footericon)
                    .setTitle(`❌ ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                ]
            })
        })
        .on("initQueue", queue => {
            queue.autoplay = false;
            queue.volume = 100;
            queue.filter = "clear";
        }
        )

}