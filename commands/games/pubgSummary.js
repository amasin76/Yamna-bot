const { MessageEmbed } = require('discord.js');
const { access_api } = process.env;
const paginator = require('../../util/ButtonPaginator')
const config = require("../../config.json");
const axios = require('axios');
const { player } = require('../../util/fetchData')
const { getMember } = require('../../handlers/functions')
const playerData = require('../../models/playerSchema')

exports.run = async (client, message, args) => {
    try {
        console.time('lab')

        let accountId = null, result = null;
        let target = getMember(message, args[0]) || message.member;
        let pubgName = args[1] || args[0];
        let nav = false, save = true;
        let guideMsg = '';

        if (args[0] && !getMember(message, args[0])) {
            nav = true
            save = false
        };

        if (!nav) { result = await playerData.findOne({ _id: target.user.id }) }

        if (target && !result && !nav) {
            guideMsg = await message.channel.send({
                embeds: [new MessageEmbed().setDescription('- Please provide **IGN (in-game name)**, because this player not registered yet in database\n- Exemple: TGLTN\`\`\`fix\nim waiting to type IGN...\n\`\`\`')]
            })

            const filter = m => m.author.id == message.author.id;

            await message.channel.awaitMessages({ filter, max: 1, time: 120_000 })
                .then(collected => {
                    if (collected.size === 0) return guideMsg.delete().then(message.channel.send({
                        embeds: [new MessageEmbed().setDescription('**Session Expired**: You dont provide any IGN (in-game name)')]
                    }))
                    pubgName = collected.first().content
                    return pubgName
                }).catch(err => { console.log(err); return err });
            if (pubgName === (args[1] || args[0])) return
        }




        if (result) {
            accountId = result
        } else {
            accountId = await player(target?.user?.id, target?.user?.username, pubgName, save)
            if (accountId && save) {
                message.react('📀')
                guideMsg.edit({
                    embeds: [new MessageEmbed().setDescription(`✅ **IGN**: \`${pubgName}\` of <@${target.user.id}> successfully saved in our database`).setFooter('so next time you dont need provide IGN again')]
                })
            }
        }

        if (accountId?.status) {
            const embedErr = new MessageEmbed()
                .setTitle(`❌ ${accountId.title}`)
                .setDescription(`Error Code: ${accountId.status}\n${accountId.detail || ''}`);
            message.react('❌')
            return message.channel.send({ embeds: [embedErr] })
        }


        let res = await axios.get(`https://api.pubg.com/shards/steam/players/${accountId.pubgId || accountId}/survival_mastery`, {
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

        message.react('✅')
        message.channel.send({ embeds: [embedMain] })

        console.timeEnd('lab')
    } catch (err) {
        console.log(err)
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