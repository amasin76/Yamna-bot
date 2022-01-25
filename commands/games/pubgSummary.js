const { MessageEmbed } = require('discord.js');
const { access_api } = process.env;
const paginator = require('../../util/ButtonPaginator')
const config = require("../../config.json");
const axios = require('axios');

exports.run = async (client, message, args) => {
    console.log("in")
    try {
        if (!args[0]) return message.channel.send('Specify Player-Name\n \`Syntax: -pubg <player-name>\` \n \`Exemple: -pubg kaymind\`')

        const name = args[0]

        const player = await axios.get(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${name}`, {
            headers: {
                'Authorization': `Bearer ${access_api}`,
                'Accept': 'application/vnd.api+json'
            }
        })

        const { data: [{ id: accountId }] } = player.data

        let res = await axios.get(`https://api.pubg.com/shards/steam/players/${accountId}/survival_mastery`, {
            headers: {
                'Authorization': `Bearer ${access_api}`,
                'Accept': 'application/vnd.api+json'
            }
        })

        const { data: {
            attributes: { xp, level, lastMatchId, totalMatchesPlayed,
                stats: { airDropsCalled, damageDealt, damageTaken, distanceBySwimming,
                    distanceByVehicle, distanceOnFoot, distanceTotal, healed, hotDropLandings,
                    enemyCratesLooted, uniqueItemsLooted, position, revived, teammatesRevived,
                    timeSurvived, throwablesThrown, top10, } } } } = res.data

        const embedMain = new MessageEmbed()
            .setColor('#fcbe03')
            .setFooter(config.footertext, config.footericon)
            .setImage('https://i.imgur.com/2y88TDP.gif')
            //.setThumbnail('https://pngimg.com/uploads/pubg/pubg_PNG8.png')
            .setAuthor('PUBG STATS / SUMMARY', 'https://www.logolynx.com/images/logolynx/c3/c3ffc8726b01df955af0b9dadb1f7f13.png', 'https://discord.com/api/oauth2/authorize?client_id=807868627302350868&permissions=8&scope=bot')
            .setDescription(`\`\`\`js\n Matches = ${totalMatchesPlayed} | Level = ${level} | XP = ${xp} \n\`\`\`\n`)
            .addFields(
                {
                    name: "🏁 Survive",
                    value: `│ Total : ${Math.round(timeSurvived.total / 60 / 60)} h\n│ Avrg : ${Math.round(timeSurvived.average / 60)} m\n│ Best : ${Math.round(timeSurvived.careerBest / 60)} m\n│ Last : ${Math.round(timeSurvived.lastMatchValue / 60)} m`,
                    inline: true
                },
                {
                    name: "🚀 Distance Total",
                    value: `│ Total : ${Math.round(distanceTotal.total / 1000)} km\n│ Avrg : ${Math.round(distanceTotal.average / 1000)} km\n│ Best : ${Math.round(distanceTotal.careerBest / 1000)} km\n│ Last : ${distanceTotal.lastMatchValue > 1000 ? Math.round(distanceTotal.lastMatchValue / 1000) + ' km' : Math.round(distanceTotal.lastMatchValue) + ' m'} `,
                    inline: true
                },
                {
                    name: "🏥 Revived",
                    value: `│ Total : ${revived.total}\n│ Avrg : ${(revived.average).toFixed(2)}\n│ Best : ${(revived.careerBest).toFixed(2)}\n│ Last : ${(revived.lastMatchValue).toFixed(2)}`,
                    inline: true
                },
                // {
                //     name: "\u200b",
                //     value: "\u200b",
                //     inline: false
                // },
                {
                    name: "🎯 Damage Dealt",
                    value: `│ Total : ${Math.round(damageDealt.total)}\n│ Avrg : ${Math.round(damageDealt.average)}\n│ Best : ${Math.round(damageDealt.careerBest)}\n│ Last : ${Math.round(damageDealt.lastMatchValue)}`,
                    inline: true
                },
                {
                    name: "🛡 Damage Taken",
                    value: `│ Total : ${Math.round(damageTaken.total)}\n│ Avrg : ${Math.round(damageTaken.average)}\n│ Best : ${Math.round(damageTaken.careerBest)}\n│ Last : ${Math.round(damageTaken.lastMatchValue)}`,
                    inline: true
                },
                {
                    name: "💊 Healed",
                    value: `│ Total : ${Math.round(healed.total)}\n│ Avrg : ${Math.round(healed.average)}\n│ Best : ${Math.round(healed.careerBest)}\n│ Last : ${Math.round(healed.lastMatchValue)}`,
                    inline: true
                },
                // {
                //     name: "\u200b",
                //     value: "\u200b",
                //     inline: false
                // },
                {
                    name: "🚕 By Vehicle",
                    value: `│ Total : ${Math.round(distanceByVehicle.total / 1000)} km\n│ Avrg : ${Math.round(distanceByVehicle.average / 1000)} km\n│ Best : ${Math.round(distanceByVehicle.careerBest / 1000)} km\n│ Last : ${distanceByVehicle.lastMatchValue > 1000 ? Math.round(distanceByVehicle.lastMatchValue / 1000) + ' km' : Math.round(distanceByVehicle.lastMatchValue) + ' m'} `,
                    inline: true
                },
                {
                    name: "👣 On Foot",
                    value: `│ Total : ${Math.round(distanceOnFoot.total / 1000)} km\n│ Avrg : ${Math.round(distanceOnFoot.average / 1000)} km\n│ Best : ${Math.round(distanceOnFoot.careerBest / 1000)} km\n│ Last : ${distanceOnFoot.lastMatchValue > 1000 ? Math.round(distanceOnFoot.lastMatchValue / 1000) + ' km' : Math.round(distanceOnFoot.lastMatchValue) + ' m'} `,
                    inline: true
                },
                {
                    name: "🤿 By Swimming",
                    value: `│ Total : ${distanceBySwimming.total > 1000 ? Math.round(distanceBySwimming.total / 1000) + ' km' : Math.round(distanceBySwimming.total) + ' m'}\n│ Avrg : ${Math.round(distanceBySwimming.average)} m\n│ Best : ${Math.round(distanceBySwimming.careerBest)} m\n│ Last : ${distanceBySwimming.lastMatchValue > 1000 ? Math.round(distanceBySwimming.lastMatchValue / 1000) + ' km' : Math.round(distanceBySwimming.lastMatchValue) + ' m'} `,
                    inline: true
                },
                // {
                //     name: "\u200b",
                //     value: "\u200b",
                //     inline: false
                // },
                {
                    name: "🎇 AirDrops Called",
                    value: `│ Total : ${airDropsCalled.total}\n│ Avrg : ${Math.round(airDropsCalled.average)}\n│ Best : ${airDropsCalled.careerBest}\n│ Last : ${airDropsCalled.lastMatchValue}`,
                    inline: true
                },
                {
                    name: "⚰ Crates Looted",
                    value: `│ Total : ${enemyCratesLooted.total}\n│ Avrg : ${Math.round(enemyCratesLooted.average)}\n│ Best : ${enemyCratesLooted.careerBest}\n│ Last : ${enemyCratesLooted.lastMatchValue}`,
                    inline: true
                },
                {
                    name: "🔧 items Looted",
                    value: `│ Total : ${uniqueItemsLooted.total}\n│ Avrg : ${Math.round(uniqueItemsLooted.average)}\n│ Best : ${uniqueItemsLooted.careerBest}\n│ Last : ${uniqueItemsLooted.lastMatchValue}`,
                    inline: true
                },
                // {
                //     name: "\u200b",
                //     value: "\u200b",
                //     inline: false
                // },
                {
                    name: "💣 Throwables Thrown",
                    value: `│ Total : ${throwablesThrown.total}\n│ Avrg : ${throwablesThrown.average.toFixed(2)}\n│ Best : ${throwablesThrown.careerBest}\n│ Last : ${throwablesThrown.lastMatchValue}`,
                    inline: true
                },
                {
                    name: "🔥 Hot Drops",
                    value: `│ Total : ${(hotDropLandings.total).toFixed(2)} %\n│ Avrg : n/a\n│ Best : n/a\n│ Last : n/a`,
                    inline: true
                },
                {
                    name: "🏅 position",
                    value: `│ Total : n/a\n│ Avrg : ${Math.round(position.average)}\n│ Best : ${position.careerBest}\n│ Last : ${position.lastMatchValue}`,
                    inline: true
                },

            )
        message.channel.send({ embeds: [embedMain] })
    } catch (err) {

    }

}
exports.help = {
    name: 'pubg',
    description: 'Get pubg life-time summary',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: [],
    userPermissions: [],
    cooldown: 5
}