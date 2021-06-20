const fetch = require("node-fetch");
const config = require("../../config.json");
const api_key = process.env.RAWG_API

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(`**Please provide game name**`).then(msg => msg.delete({ timeout: 15000 }));
    const search = args.join('-')

    try {
        const getSearchGame = async (search = 'the-witcher-3-wild-hunt') => {
            let response = await fetch(`https://api.rawg.io/api/games/${search}?key=${api_key}`)
            let data = await response.json()
            return data
        }
        data = await getSearchGame(search)

        if (data?.detail) return message.channel.send(`**Search**:\`${search} : ${data?.detail}\`\n**Did not match any documents** | check keywords`).then(msg => msg.delete({ timeout: 30000 }))

        let { id, name_original, released, updated, background_image, website, metacritic, metacritic_platforms, movies_count, parent_platforms, developers, publishers, esrb_rating, description_raw } = data
        //let metacriticUrl; !!metacritic_platforms[0]?.url ? metacriticUrl = metacritic_platforms[0].url : undefined
        let metacriticUrl = metacritic_platforms?.[0]?.url, developer = developers?.[0]?.name, publisher = publishers?.[0]?.name;
        //get and mapping trailers by id with max resolution
        if (movies_count !== 0) {
            var getTrailerGame = async (id) => {
                let response = await fetch(`https://api.rawg.io/api/games/${id}/movies?key=${api_key}`)
                let trailerData = await response.json()
                return trailerData
            }
            let trailerData = await getTrailerGame(id)
            var trailer = trailerData?.results.map(i => i?.data?.['max'])
        }
        //Shorten descriptino (secend Dot will cut sting)
        let getCharPosition = (string, subString, index) => {
            return string.split(subString, index).join(subString).length;
        }
        let indexOf = getCharPosition(description_raw, '.', 2)
        let description = description_raw.substring(0, indexOf)
        //mapping and get trailers by id with max resolution
        // let trailerData = await getTrailerGame(id)
        // let trailer = trailerData.results.map(i => i.data['max'])
        //mapping Platformes
        let platforms = parent_platforms.map(i => i.platform.name)

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
                },
                {
                    name: ":keyboard: Developer",
                    value: `${developer}`,
                    inline: true
                },
                {
                    name: ":moneybag: Publishers",
                    value: `${publisher}`,
                    inline: true
                },
                {
                    name: ":link: Website",
                    value: `[Link](${website})`,
                    inline: true
                },
                {
                    name: ":satellite_orbital: Released",
                    value: `${released}`,
                    inline: true
                },
                {
                    name: " :repeat: Updated",
                    value: `${updated.substring(0, updated.indexOf("T"))}`,
                    inline: true
                },
                {
                    name: ":clapper: Traile(s)",
                    value: `${!!trailer ? `[1](${trailer?.[0]})` : 'N/A'} ${trailer && trailer?.[1] ? `⦿ [2](${trailer?.[1]})` : ''}`,
                    inline: true
                },
                {
                    name: ":desktop: platform(s)",
                    value: `${platforms.join('◦')}`,
                    inline: true
                },
                {
                    name: ":man_police_officer: ESRB Rating",
                    value: `${esrb_rating?.name || 'N/A'}`,
                    inline: true
                }
            ))
    } catch (err) {
        console.error(err);
    };

}
exports.help = {
    name: "game",
    description: "simulation of joining member",
    usage: "<prefix>simjoin",
    example: "~simjoin"
}
exports.conf = {
    aliases: [""],
    cooldown: 5
}