const fetch = require("node-fetch");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
    try {
        const token = "5661E4716C04A4A4AE01F44674DA790A"; //I reset mine.
        const id = args[0]
        if (!args[0]) return message.channel.send("Please provide an account name!");
        /*const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${args[0]}`;
    
        fetch(url).then(res => res.json()).then(body => {
            if (body.response.success === 42) return message.channel.send("I was unable to find a steam profile with that name");
    
            const id = body.response.steamid;*/
        const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${id}`;
        const bans = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${token}&steamids=${id}`;
        const recent = ` http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${token}&steamid=${id}&format=json`
        const state = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];

        fetch(summaries).then(res => res.json()).then(body => {
            if (!body.response) return message.channel.send("I was unable to find a steam profile with that name");
            const { personaname, avatarfull, realname, personastate, loccountrycode, profileurl, timecreated } = body.response.players[0];

            fetch(recent).then(res => res.json()).then(body => {
                if (!body.response) return message.channel.send("I was unable to find a steam profile with that name");
                let recent = body.response.games;
                let copy = [];
                for (var i = 0; i < recent.length; i++) {
                    copy.push(`${recent[i].name}(${Math.round(recent[i].playtime_forever / 60)}h)🎮`)
                }

                fetch(bans).then(res => res.json()).then(body => {
                    if (!body.players) return message.channel.send("I was unable to find a steam profile with that name");
                    const { NumberOfVACBans, NumberOfGameBans } = body.players[0];

                    const embed = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor(`${personaname}`, "https://cdn.freebiesupply.com/images/large/2x/steam-logo-transparent.png")
                        .setThumbnail(avatarfull)
                        .setDescription(`**Real Name :** ${realname || "Unknown"}
                **Status :** ${state[personastate]}
                **Country :** :flag_${loccountrycode ? loccountrycode.toLowerCase() : "white"}:
                **Account Created :** ${moment.unix(timecreated).format('DD/MM/YYYY')} (${moment.unix(timecreated).fromNow()})
                **Bans:** Va c: ${NumberOfVACBans}, Game: ${NumberOfGameBans}
                **Recent Games :** \`${copy}\`
                **Link :** [Profile](${profileurl})`)
                        .setTimestamp();

                    message.channel.send(embed)

                })
            })
        })
    } catch (err) {
        console.log(err)
    }
}
exports.help = {
    name: "steam",
    description: "Shuffles the Queue",
    usage: "<prefix>mix",
    example: "~mix"
}
exports.conf = {
    aliases: ["st"],
    cooldown: 5
}