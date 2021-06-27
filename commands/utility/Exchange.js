const fetch = require("node-fetch");

exports.run = async (client, message, args) => {
    try {
        const api_key = "802e281253e1ea7a10c855e8bf1af817"
        const from = args[0]; const to = args[1]; const amount = parseInt(args[2]);
        const getEXchange = async (from = 'USD', to = 'MAD', amount = 1) => {
            let response = await fetch(`https://api.currencyscoop.com/v1/latest?api_key=${api_key}&base=${from}`)
            let data = await response.json(); const code = data.meta.code//console.log(data);
            if (code === 200) {
                const { date, base } = data.response
                const { MAD, USD, EUR, DZD, SAR, TND } = data.response.rates//.map(v => v.toFixed(2))
                const embed = new Discord.MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor("Currency Change", message.author.displayAvatarURL({ format: 'png' }))
                    .setThumbnail("https://freepngimg.com/thumb/money/63478-converter-exchange-symbol-foreign-currency-rate-market.png")
                    .setDescription(`**Date :** ${date}
                **Base :** ${base}\n`)
                    .addFields(
                        {
                            name: `:flag_ma: MAD`,
                            value: ` ${MAD.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `:flag_dz: DZD`,
                            value: ` ${DZD.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `:flag_tn: TND`,
                            value: ` ${TND.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `:flag_sa: SAR`,
                            value: ` ${SAR.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `:flag_eu: EUR`,
                            value: ` ${EUR.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `:flag_us: USD`,
                            value: ` ${USD.toFixed(2)}`,
                            inline: true
                        })
                    .setTimestamp();

                message.channel.send(embed)
            } else {
                const errorCode = {
                    401: "Unauthorized Missing or incorrect API token in header.",
                    422: "Unprocessable Entity, this could be malformed JSON or incorrect fields.",
                    500: "Issue with Currencyscoop's servers processing your request.",
                    503: "Service Unavailable During planned service outages.",
                    429: "Too many requests. API limits reached.",
                    600: "Maintenance - The Currencyscoop API is offline for maintenance.",
                    601: "Unauthorized Missing or incorrect API token.",
                    602: "Invalid query parameters.",
                    603: "Authorized Subscription level required."
                }
                message.channel.send(`**Error ${code}** : ${errorCode[code]}`).then(msg => msg.delete({ timeout: 20 * 1000 }))
            }
        }
        getEXchange(from, to, amount)
    } catch (err) {
        console.error(err);
    };//soccer - sunnah -
}
exports.help = {
    name: "exchange",
    description: "real-time rates of all currencies we support",
    usage: "<prefix>ex",
    example: "=ex"
}
exports.conf = {
    aliases: ["ex", "currency"],
    premium: true,
    cooldown: 5
}