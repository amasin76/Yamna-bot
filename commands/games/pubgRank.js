const axios = require('axios');
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const { access_api } = process.env;

exports.run = async (client, message, args) => {
    try {
        if (!args[0] || !args[1]) return message.channel.send('Specify Player-name and Season\n \`Syntax: <prefix>pubg-rank <player-name> <season>\` \n \`Exemple: =pubg-rank best_noob 10\`').then(msg => msg.delete({ timeout: 15000 }))
        let name = args[0];
        let season = parseInt(args[1]);
        //console.log(name, season)
        const getId = (name, season) => {
            axios.get(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${name}`, {
                headers: {
                    'Authorization': `Bearer ${access_api}`,
                    'Accept': 'application/vnd.api+json'
                }
            })
                .then((res) => {
                    const data = res.data.data[0].id
                    //console.log(data)
                    return data;
                })
                .then((data) => {
                    let resp = axios.get(`https://api.pubg.com/shards/steam/players/${data}/seasons/division.bro.official.pc-2018-${season}/ranked`, {
                        headers: {
                            'Authorization': `Bearer ${access_api}`,
                            'Accept': 'application/vnd.api+json'

                        }
                    })
                    //console.log(resp);
                    return resp;
                })
                .then((resp) => {
                    //let status = resp.status
                    let lifeStats = resp.data.data.attributes.rankedGameModeStats['squad-fpp']//.data[0].attributes.gameModeStats[`${mode}`]
                    //console.log(lifeStats)
                    return message.channel.send(new MessageEmbed()
                        .setColor('#fcbe03')
                        .setFooter(config.footertext, config.footericon)
                        .setThumbnail('https://pngimg.com/uploads/pubg/pubg_PNG8.png')
                        .setAuthor('PUBG STATS / Ranked', 'https://www.logolynx.com/images/logolynx/c3/c3ffc8726b01df955af0b9dadb1f7f13.png', 'https://discord.gg/CyH8avz')
                        //.setTitle(`LIFE-TIME STATS IN GAME`)
                        .setDescription(`\`\`\` Player Name : ${name} || Season : ${season} \`\`\``)
                        .addFields(
                            {
                                name: "🏁Rounds Played ",
                                value: ` ${lifeStats.roundsPlayed}`,
                                inline: true
                            },
                            {
                                name: "🏆Current Tier: ",
                                value: ` __${lifeStats.currentTier.tier} ${Math.round(lifeStats.currentTier.subTier)}__`,
                                inline: true
                            },
                            {
                                name: "🎫Current Rank Point ",
                                value: ` ${lifeStats.currentRankPoint}`,
                                inline: true
                            },
                            {
                                name: "🏁Wins ",
                                value: ` ${lifeStats.wins}`,
                                inline: true
                            },
                            {
                                name: "🏆Best Tier: ",
                                value: ` ${lifeStats.bestTier.tier} ${lifeStats.bestTier.subTier}`,
                                inline: true
                            },
                            {
                                name: "🎫Best Rank Point ",
                                value: ` ${lifeStats.bestRankPoint}`,
                                inline: true
                            },
                            {
                                name: "🚨winRatio ",
                                value: ` ${lifeStats.winRatio.toFixed(3)}`,
                                inline: true
                            },
                            {
                                name: "🚨K/D ",
                                value: ` ${lifeStats.kda.toFixed(3)}`,
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
                            .setTitle(`❌ ERROR | Unexpected response status`)
                            .setDescription(`\`\`\`${error.stack}\`\`\``))
                            .then(msg => msg.delete({ timeout: 8000 }))
                    }

                })

            //return lifeStats = resp.data.data[0].attributes.gameModeStats.mode
        }
        getId(name, season)
    } catch (err) {
        console.log(err)
    }
};
exports.help = {
    name: "pubg-rank",
    description: "Get pubg Rank stats",
    usage: "<prefix>pubg <player name><mode>",
    example: "=pubg cubevilly squad-fpp"
};

exports.conf = {
    aliases: ["pr"],
    cooldown: 5
}