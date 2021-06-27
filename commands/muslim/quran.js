const ytdl = require('ytdl-core');
const { CHANNEL, SERVER, LIVE } = require("../../config.json");

exports.run = async (client, message, args) => {
    let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)

    if (!channel) return;
    const connection = await channel.join();
    await connection.voice.setSelfDeaf(true)
    connection.play(ytdl(LIVE))


    setInterval(async () => {
        if (!client.voice.connections.get(SERVER)) {
            let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)
            if (!channel) return;

            const connection = await channel.join()
            connection.play(ytdl(LIVE))
        }
    }, 20000)
}

exports.help = {
    name: "quran",
    description: " temp mute a user",
    usage: "tmute @user <time>",
    example: "~tmute @sam 1h"
}

exports.conf = {
    aliases: ["qr"],
    cooldown: 5
}