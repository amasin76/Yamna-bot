const { CHANNEL, SERVER, LIVE } = require("../config.json");
const ytdl = require('ytdl-core');

module.exports = async client => {
    console.log(`${client.user.username} im ready`)
    // bot.user.setActivity("Hello", {type: "STREAMING", url:"https://twitch.tv/Strandable"});
    let statuses = [
        //`${client.guilds.size} servers!`,
        "8help",
        "💖THE EPICS💖",
        "صلوا على شفيع الأمة",
        `💖${client.users.cache.size} 𝙐𝙎𝙀𝙍𝙎💖`,
        "Javascript",
        "V1.0",
        "By | 7ANKALISS✨",
        `💖${client.users.cache.size} 𝙐𝙎𝙀𝙍𝙎💖`,
    ]


    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, { type: "WATCHING" });

    }, 300000)

    /*let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)

    if (!channel) return;
    const connection = await channel.join();
    connection.play(ytdl(LIVE))

    setInterval(async function () {
        if (!client.voice.connections.get(SERVER)) {
            let channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)
            if (!channel) return;

            const connection = await channel.join()
            connection.play(ytdl(LIVE))
        }
    }, 20000)*/

}