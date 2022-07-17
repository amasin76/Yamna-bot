const { MessageAttachment } = require("discord.js")
const Welcomer = require('../../util/welcomer');


exports.run = async (client, message, args) => {
    console.log(1)
    const image = new Welcomer()
    .setBackground("https://i.imgur.com/Fu45Y3W.gif")
    .setGIF(true)
    .setAvatar("https://i.imgur.com/rA4rb0Vt.png")
    .setName("BIO-DEV")
    .setDiscriminator("#0001")
    .setBlur(0)

    let welcomeImage = new Discord.MessageAttachment(await image.generate(), "welcome-image.gif");
    console.log(2)
    await message.channel.send({ files: [welcomeImage] })

    // return message.channel.send({
    //     files: [ new MessageAttachment(await image.generate(), "welcome-image.gif") ]
    // })
}
exports.help = {
    name: 'test',
    description: '',
    usage: '<prefix>',
    example: '='
}
exports.conf = {
    aliases: ["wel"],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 5
}