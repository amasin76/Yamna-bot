const { CHANNEL, SERVER, LIVE } = require("../config.json");

module.exports = async client => {
    console.log(`${client.user.username} im ready`)
    // bot.user.setActivity("Hello", {type: "STREAMING", url:"https://twitch.tv/Strandable"});
    let statuses = [
        //`${client.guilds.size} servers!`,
        "=help",
        "💖THE EPICS💖",
        "صلوا على شفيع الأمة",
        `💖${client.users.cache.size} 𝙐𝙎𝙀𝙍𝙎💖`,
        "Javascript",
        "V2.1",
        "By | 7ANKALISS✨",
        `💖${client.users.cache.size} 𝙐𝙎𝙀𝙍𝙎💖`,
    ]


    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, { type: "WATCHING" });

    }, 300000)
}
