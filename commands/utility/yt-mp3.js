const axios = require("axios")
const cheerio = require("cheerio")

exports.run = async (client, message, args) => {
    const progressMessage = await message.channel.send(':stopwatch: Please wait a few seconds');
    const rawVideoID = args[0].match(/v=([a-zA-Z0-9_-]+)?/g)
    const videoID = rawVideoID[0]?.slice(2)

    const response = await axios.get(`https://www.yt-download.org/api/widget/mp3/${videoID}`)

    const $ = cheerio.load(response.data)

    const title = $("div.text-center h2").text()
    const img = $("img").attr("src")

    let info = [], link = [];
    $("div.text-center div a").each((i, element) => {
        link.push($(element).attr('href'))
        info.push($(element).text().trim().replace(/\s\s+/g, ' ').split(" "))//.splice(-2, 2)
    })
    console.log(info)

    if (progressMessage.deletable) progressMessage.delete();

    const embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle("YouTube To MP3")
        .setImage(`${img || null}`)
        .setDescription(`\`\`\`${title}\`\`\`\n:inbox_tray: | [${info[0][1]}](${link[0]}) kbps ◐ ${info[0][3]} ${info[0][4]}\n:inbox_tray: | [${info[1][1]}](${link[1]}) kbps ◐ ${info[1][3]} ${info[1][4]}\n:inbox_tray: | [${info[2][1]}](${link[2]}) kbps ◐ ${info[2][3]} ${info[2][4]}\n:inbox_tray: | [${info[3][1]}](${link[3]}) kbps ◐ ${info[3][3]} ${info[3][4]}`)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    return message.channel.send(embed)

}
exports.help = {
    name: 'yt-mp3',
    description: 'convert youtube video to mp3',
    usage: '<prefix>yt3 <URL>',
    example: '--'
}
exports.conf = {
    aliases: ['ymp3', 'yt3'],
    cooldown: 10
}