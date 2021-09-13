

/*module.exports = async client => {
    try {
        const getFreebies = async (type = 'game') => {
            let response = await fetch(`https://www.gamerpower.com/api/giveaways?platform=pc&type=${type}&sort-by=value`)
            let data = await response.json()
            return data
        }

        data = await getFreebies()
        if (data.length === 0) return message.channel.send(`**Search**:\`${gameName}\`\n**Did not match any documents** | check keywords`).then(msg => msg.delete({ timeout: 30000 }))
        await message.channel.send(new MessageEmbed()
            .setColor('#fcbe03')
            .setFooter(config.footertext, config.footericon)
            .setThumbnail(`${thumb[0]} `)
            .setAuthor('DEALS / COMPARE PRICES IN STORES', 'https://imgur.com/kCvLN92.png', 'https://discord.com/api/oauth2/authorize?client_id=807868627302350868&permissions=8&scope=bot')
            .setDescription(`\`\`\` Search : ${gameName} \n Release Date : ${releaseDate[0] != 0 ? moment.unix(releaseDate[0]).format('DD/MM/YYYY') : 'N/A'}\`\`\`\n${copy.join(' ')}`))
    } catch (err) {
        console.error(err);
    };
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, { type: "WATCHING" });

    }, 300000)
}*/