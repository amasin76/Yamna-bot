const axios = require('axios');
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjZTI3YjczMC1lZTNlLTAxMzgtMWQzNC00YmMyNjVmMzEyYjEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjAyNDU1MjIwLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Ii02NjZlZDllNy0xMzBjLTQ3OTgtOGExYS0yOWM0YTMzMjczMDYifQ.fUqQ4voq0kupQ4VaxFtCAnKAZbc7OwxNbcYpBnwVuog'
        let name = args[0];
        let mode = args[1];
        console.log(name, mode)
        const getId = (name, mode) => {
            axios.get(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${name}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/vnd.api+json'

                }
            })
                .then((res) => {
                    //console.log(res.data.data[0].id)
                    const data = res.data.data[0].id
                    return data;
                })
                .then((data) => {
                    let resp = axios.get(`https://api.pubg.com/shards/steam/seasons/lifetime/gameMode/${mode}/players?filter[playerIds]=${data}&filter[gamepad]=false`, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Accept': 'application/vnd.api+json'

                        }
                    })
                    console.log(resp);
                    return resp;
                })
                .then((resp) => {
                    lifeStats = resp.data.data[0].attributes.gameModeStats[`${mode}`]
                    //console.log(lifeStats)
                    return lifeStats
                })
                .then((LifeStats) => {
                    //console.log(lifeStats)
                    return message.channel.send(new MessageEmbed()
                        .setColor(config.wrongcolor)
                        .setFooter(config.footertext, config.footericon)
                        .setTitle(` PUBG | LIFE-TIME STATS | Mode : \`${mode}\``)
                        .addFields(
                            {
                                name: "🏁Rounds Played: ",
                                value: ` ${Math.round(lifeStats.roundsPlayed)}`,
                                inline: true
                            },
                            {
                                name: "📆Days Played: ",
                                value: ` ${Math.round(lifeStats.days)}`,
                                inline: true
                            },
                            {
                                name: "💀Kills: ",
                                value: ` ${Math.round(lifeStats.kills)}`,
                                inline: true
                            },
                            {
                                name: "🔺Most Kills: ",
                                value: ` ${Math.round(lifeStats.roundMostKills)}`,
                                inline: true
                            },
                            {
                                name: "🎯Longest Kill: ",
                                value: ` ${Math.round(lifeStats.longestKill)}`,
                                inline: true
                            },
                            {
                                name: "🚦Road Kills: ",
                                value: ` ${Math.round(lifeStats.roadKills)}`,
                                inline: true
                            },
                            {
                                name: "💔Team Kill: ",
                                value: ` ${Math.round(lifeStats.teamKills)}`,
                                inline: true
                            },
                            {
                                name: "💣Suicides: ",
                                value: ` ${Math.round(lifeStats.suicides)}`,
                                inline: true
                            },
                            {
                                name: "💥Vehicle Destroys: ",
                                value: ` ${Math.round(lifeStats.vehicleDestroys)}`,
                                inline: true
                            },
                            {
                                name: "👣Walk Distance: ",
                                value: ` ${Math.round((lifeStats.walkDistance) / 1000)} KM`,
                                inline: true
                            },
                            {
                                name: "🚗Ride Distance: ",
                                value: ` ${Math.round((lifeStats.rideDistance) / 1000)} KM`,
                                inline: true
                            }
                        )
                    )
                    // .setField(`Longest Kill: \`${Math.round(lifeStats.longestKill)}\``)
                    // .setField(`Road Kills: \`${Math.round(lifeStats.roadKills)}\``))
                    //.setField("Suicides", `\`${Math.round(lifeStats.suicides)}\``, true)
                    //.setField("Kills", `\`${Math.round(lifeStats.kills)}\``, true)
                    //.setField("Rounds Played", `\`${Math.round(lifeStats.roundsPlayed)}\``, true)
                    //.setField("wins", `\`${Math.round(lifeStats.wins)}\``, true)
                })
                .catch((error) => {
                    console.error(error)
                })

            //return lifeStats = resp.data.data[0].attributes.gameModeStats.mode
        }
        getId(name, mode)
    } catch (err) {
        console.log(err)
    }
};
exports.help = {
    name: "pubg",
    description: "Ponged!",
    usage: "/ping",
    example: "/ping"
};

exports.conf = {
    aliases: ["beep"],
    cooldown: 5
}