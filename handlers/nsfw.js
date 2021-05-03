const axios = require('axios') //you can use any http client
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const { MessageEmbed } = require('discord.js');
const config = require("../config.json");

module.exports = client => {
    console.log(" :: LOADED NFSW.JS ")
    /** @INFO NO PUBLIC VERSION
    */
    client.on("message", message => {
        if (message.author.bot) return;
        if (!message.content.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/m) && message.attachments.map(x => x.proxyURL).length == 0) return;
        ///(https?:\/\/.*\.(?:png|jpg))/
        try {
            let URL = message.attachments.map(x => x.proxyURL)
            if (message.attachments.map(x => x.proxyURL) == 0) {
                let stringURL = message.content.match(/^(http: \/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/m)[0]
                URL = stringURL
            }

            async function fn() {
                const pic = await axios.get(`${URL}`, {
                    responseType: 'arraybuffer',
                })
                const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
                // Image must be in tf.tensor3d format
                // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
                const image = await tf.node.decodeImage(pic.data, 3)
                const predictions = await model.classify(image)
                image.dispose() // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
                console.log(predictions)
                let isSexy = (name) => {
                    return name.className === 'Sexy';
                }
                valueSexy = Object.values(predictions.find(isSexy))
                let isPorn = (name) => {
                    return name.className === 'Porn';
                }
                valuePorn = Object.values(predictions.find(isPorn))
                let isHentai = (name) => {
                    return name.className === 'Hentai';
                }
                valueHentai = Object.values(predictions.find(isHentai))
                let isNeutral = (name) => {
                    return name.className === 'Neutral';
                }
                valueNeutral = Object.values(predictions.find(isNeutral))
                let isDrawing = (name) => {
                    return name.className === 'Drawing';
                }
                valueDrawing = Object.values(predictions.find(isDrawing))

                if (valueHentai[1] >= 0.35) {
                    await message.delete().catch(console.error)
                    await message.channel.send(new MessageEmbed()
                        .setColor(config.wrongcolor)
                        .setFooter(config.footertext, config.footericon)
                        .setTitle("⛔ NSFW Detected")
                        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                        .setDescription(`➖ **Hentai** = \`${(valueHentai[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`))
                        .then(msg => msg.delete({ timeout: 20 * 1000 }))
                }
                else if (valuePorn[1] >= 0.35) {
                    await message.delete().catch(console.error)
                    await message.channel.send(new MessageEmbed()
                        .setColor(config.wrongcolor)
                        .setFooter(config.footertext, config.footericon)
                        .setTitle("⛔ NSFW Detected")
                        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                        .setDescription(`➖ **Porn** = \`${(valuePorn[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`))
                        .then(msg => msg.delete({ timeout: 20 * 1000 }))
                }
                else if (valueSexy[1] >= 0.7) {
                    await message.delete().catch(console.error)
                    await message.channel.send(new MessageEmbed()
                        .setColor(config.wrongcolor)
                        .setFooter(config.footertext, config.footericon)
                        .setTitle("⛔ NSFW Detected")
                        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                        .setDescription(`➖ **Sexy** = \`${(valueSexy[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`))
                        .then(msg => msg.delete({ timeout: 20 * 1000 }))
                }
                else {
                    await message.channel.send(new MessageEmbed()
                        .setColor('#00EB2B')
                        .setFooter(config.footertext, config.footericon)
                        .setTitle("✅ Safe Content")
                        .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                        .setDescription(`➖ **Neutral** = \`${(valueNeutral[1] * 100).toFixed(2)}\`% \n ➖ **Drawing** = \`${(valueDrawing[1] * 100).toFixed(2)}\`%`))
                        .then(msg => msg.delete({ timeout: 3000 }))
                }
            }
            fn()
        } catch (err) {
            console.log(err)
        }
    })
}