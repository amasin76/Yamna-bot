const fetch = require("node-fetch");

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(`**Please provide IP Adresse**`).then(msg => msg.delete({ timeout: 15000 }));
    const whois = await fetch(`http://ip-api.com/json/${args[0]}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,timezone,currency,isp,org,as,mobile,proxy,hosting,query`).then(response => response.json());
    if (message.deletable) message.delete();
    if (whois.status == 'fail') {
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter((message.author.username), message.author.avatarURL())
            .setTimestamp()
            .setTitle(`Retrieving data for ${args[0]} failed`)
            .setDescription(whois.message)
        message.channel.send({ embeds: [embed] });
        return;
    }
    const embed = new Discord.MessageEmbed()
        .setTitle('Results')
        .setFooter((message.author.username), message.author.avatarURL())
        .setTimestamp()
        .setColor("GREEN")
        .addFields(
            { name: 'IP', value: `||${whois.query}||`, inline: true },
            { name: 'Country', value: `${whois.country || "None"} (${whois.countryCode || "None"})`, inline: true },
            { name: 'Region', value: `${whois.regionName || "None"} (${whois.region || "None"})`, inline: true },
            { name: 'City', value: `${whois.city || "None"}`, inline: true },
            { name: 'Zip code', value: `${whois.zip || "None"}`, inline: true },
            { name: 'Time zone', value: `${whois.timezone || "None"}`, inline: true },
            { name: 'Continent', value: `${whois.continent || "None"} (${whois.continentCode || "None"})`, inline: true },
            { name: 'Currency', value: `${whois.currency || "None"}`, inline: true },
            { name: 'ISP', value: `${whois.isp || "None"}`, inline: true }
        )
    if (whois.proxy == true) {
        embed.addFields({ name: 'Additional information', value: 'This is a Tor/VPN/Proxy IP' })
    } else if (whois.mobile == true) {
        embed.addFields({ name: 'Additional information', value: 'This IP is used by mobile data' })
    } else if (whois.hosting == true) {
        embed.addFields({ name: 'Additional information', value: 'This is a hosting service/datacenter IP' })
    }
    message.channel.send({ embeds: [embed] });
}
exports.help = {
    name: "ip-who",
    description: "Returns information about an IP address",
    usage: "<prefix>ip",
    example: "=ip"
}
exports.conf = {
    aliases: ["ip"],
    cooldown: 5
}