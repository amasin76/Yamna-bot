const axios = require('axios');
const config = require("../../config.json");
const api_key = process.env.FOOTBALL_DATA_API

exports.run = async (client, message, args) => {
    try {
        const getTable = async () => {
            let response = await axios({
                method: 'get',
                url: 'https://api.football-data.org/v2/competitions/2021/standings?standingType=HOME',
                headers: {
                    'X-Auth-Token': api_key
                }
            })
            //let data = await response.json()
            return response.data
        }
        data = await getTable()
        console.log(data)
        const { nameComp, plan, lastUpdated } = data?.competition
        const { startDate, endDate, currentMatchday, winner } = data?.season
        const { table } = data?.standing?.[0] //form exp: 'W,W,W,D,L'
        console.log(table.length)

        let copy = [];
        //let position, team.name, points, playedGames
        for (let i = 0; i <= table.length; i++) {
            copy.push(``)
        }

        await message.channel.send(new Discord.MessageEmbed()
            .setColor('BLACK')
            .setFooter(config.footertext, config.footericon)
            .setImage(`${background_image}`)
            .setTitle(`:heart_on_fire: GAME INFO / ${name_original.toUpperCase()} :heart_on_fire:`)
            .setDescription(`\`\`\`${description}...\`\`\``)
            .addFields(
                {
                    name: ":military_medal: Metacritic",
                    value: `[${metacritic}/100](${metacriticUrl})`,
                    inline: true
                }
            ))
    } catch (err) {
        console.error(err)
    }
}
exports.help = {
    name: "football",
    description: "real-time rates of all currencies we support",
    usage: "<prefix>ex",
    example: "=ex"
}
exports.conf = {
    aliases: [],
    cooldown: 5
}
//Premier League id 2021  //bundesliga id 2002  //liga 2014  copa 2079 // UEFA 2001
//Lique 1 2015 //Eredivisie 2003 //Serie A 2019

