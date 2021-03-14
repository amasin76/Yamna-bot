const axios = require('axios');
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const { access_api } = process.env;

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return message.channel.send('Specify Player-name and Mode\n \`Syntax: <prefix>pubg-rank <player-name> <Mode>\` \n \`Exemple: =pubg-rank best_noob squad-fpp\`').then(msg => msg.delete({ timeout: 15000 }))
        let name = args[0];
        let mode = args[1];
        console.log(name, mode)
        const getId = (name, mode = 'squad-fpp') => {
            axios.get(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${name}`, {
                headers: {
                    'Authorization': `Bearer ${access_api}`,
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
                            'Authorization': `Bearer ${access_api}`,
                            'Accept': 'application/vnd.api+json'

                        }
                    })
                    //console.log(resp);
                    return resp;
                })
                .then((resp) => {
                    let status = resp.status
                    //console.log(status)
                    let lifeStats = resp.data.data[0].attributes.gameModeStats[`${mode}`]
                    return message.channel.send(new MessageEmbed()
                        .setColor('#fcbe03')
                        .setFooter(config.footertext, config.footericon)
                        .setThumbnail('https://pngimg.com/uploads/pubg/pubg_PNG8.png')
                        .setAuthor('PUBG STATS / LIFE-TIME', 'https://www.logolynx.com/images/logolynx/c3/c3ffc8726b01df955af0b9dadb1f7f13.png', 'https://discord.gg/CyH8avz')
                        //.setTitle(`LIFE-TIME STATS IN GAME`)
                        .setDescription(`\`\`\` Player Name : ${name} || Mode : ${mode} \`\`\``)
                        .addFields(
                            {
                                name: "🏁Rounds Played ",
                                value: ` ${Math.round(lifeStats.roundsPlayed)}`,
                                inline: true
                            },
                            {
                                name: "📆Days Played ",
                                value: ` ${Math.round(lifeStats.days)}`,
                                inline: true
                            },
                            {
                                name: "💀Kills ",
                                value: ` ${Math.round(lifeStats.kills)}`,
                                inline: true
                            },
                            {
                                name: "🔺Most Kills ",
                                value: ` ${Math.round(lifeStats.roundMostKills)}`,
                                inline: true
                            },
                            {
                                name: "🎯Longest Kill ",
                                value: ` ${Math.round(lifeStats.longestKill)} m`,
                                inline: true
                            },
                            {
                                name: "🚦Road Kills ",
                                value: ` ${Math.round(lifeStats.roadKills)}`,
                                inline: true
                            },
                            {
                                name: "💔Team Kill ",
                                value: ` ${Math.round(lifeStats.teamKills)}`,
                                inline: true
                            },
                            {
                                name: "💣Suicides ",
                                value: ` ${Math.round(lifeStats.suicides)}`,
                                inline: true
                            },
                            {
                                name: "💥Vehicle Destroys ",
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
                })
                .catch((error) => {
                    let statusErr = error.response.status
                    //console.error(statusErr)

                    if (statusErr == 401) {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`❌ **ERROR ${statusErr}** : 	
                            API key invalid or missing`))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    } else if (statusErr == 404) {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`❌ **ERROR ${statusErr}** : 	
                            The specified resource was not found, The inputs not valid (username,mode..)`))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    } else if (statusErr == 415) {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`❌ **ERROR ${statusErr}** : 	
                            Content type incorrect or not specified`))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    } else if (statusErr == 415) {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`❌ **ERROR ${statusErr}** : 	
                            Content type incorrect or not specified`))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    } else if (statusErr == 429) {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`❌ **ERROR ${statusErr}** : 	
                            Too many requests`))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    } else {
                        return message.channel.send(new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setDescription(`\`\`\`${error.stack}\`\`\``))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    }

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
    description: "Get pubg life-time stats",
    usage: "<prefix>pubg <player name><mode>",
    example: "=pubg cubevilly squad-fpp"
};

exports.conf = {
    aliases: ["ps"],
    cooldown: 5
}