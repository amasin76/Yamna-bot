const fetch = require("node-fetch");
const moment = require("moment");
const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(`**Please provide game name**`).then(msg => msg.delete({ timeout: 15000 }));
    const gameName = args.join(' ')
    try {
        const getDeals = async (gameName, page = 6, sortBy = 'Price') => {
            let response = await fetch(`https://www.cheapshark.com/api/1.0/deals?&pageSize=${page}&title=${gameName}&sortBy=${sortBy}&exact=1`)
            let data = await response.json()
            if (data.length === 0) {//if no data let fetch url without exact Title
                response = await fetch(`https://www.cheapshark.com/api/1.0/deals?&pageSize=${page}&title=${gameName}&sortBy=${sortBy}&exact=0`)
                data = await response.json()
            }
            return data
        }
        const getStores = async () => {
            let response = await fetch(`https://www.cheapshark.com/api/1.0/stores`)
            let data = await response.json()
            //console.log(data)
            return data
        }
        data = await getDeals(gameName)
        if (data.length === 0) return message.channel.send(`**Search**:\`${gameName}\`\n**Did not match any documents** | check keywords`).then(msg => msg.delete({ timeout: 30000 }))

        stores = await getStores()
        //const { title, storeID, salePrice, normalPrice, savings, steamRatingText, releaseDate, lastChange, thumb } = data
        const title = data.map(i => i.title)
        const storeID = data.map(i => i.storeID)
        const salePrice = data.map(i => i.salePrice)
        const normalPrice = data.map(i => i.normalPrice)
        const savings = data.map(i => i.savings)
        const steamRatingText = data.map(i => i.steamRatingText)
        const releaseDate = data.map(i => i.releaseDate)
        const lastChange = data.map(i => i.lastChange)
        const thumb = data.map(i => i.thumb)

        let store = [], copy = [];
        for (let i = 0; i < storeID.length; i++) {
            store.push(stores.find(x => x.storeID == storeID[i]))
        }
        for (let i = 0; i < storeID.length; i++) {
            copy.push(`:heart_on_fire:**${store[i].storeName}**(-${parseInt(savings[i])}%) __Edition__: \`${title[i]}\` \n  ⟹ $**${salePrice[i]}** ⦿ ${+normalPrice[i] === +salePrice[i] ? '' : '$~~' + normalPrice[i] + '~~ ⦿'} ${steamRatingText[i] == null ? ' ' : steamRatingText[i] + ' ⦿'} Price update ${moment.unix(lastChange[i]).format('DD/MM/YY') || 'N/A'} \n\n`)
        }

        await message.channel.send(new MessageEmbed()
            .setColor('BLACK')
            .setFooter(config.footertext, config.footericon)
            .setThumbnail(`${thumb[0]} `)
            .setAuthor('DEALS / COMPARE PRICES IN STORES', 'https://imgur.com/kCvLN92.png', 'https://discord.com/api/oauth2/authorize?client_id=807868627302350868&permissions=8&scope=bot')
            .setDescription(`\`\`\` Search : ${gameName} \n Released : ${releaseDate[0] != 0 ? moment.unix(releaseDate[0]).format('DD/MM/YYYY') : 'N/A'}\`\`\`\n${copy.join(' ')}`))
    } catch (err) {
        console.error(err);
    };//soccer - sunnah -
}
exports.help = {
    name: "deal",
    description: "real-time rates of all currencies we support",
    usage: "<prefix>ex",
    example: "=ex"
}
exports.conf = {
    aliases: ["prix", "price"],
    cooldown: 5
}