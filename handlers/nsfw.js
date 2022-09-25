const axios = require('axios') //you can use any http client
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const { MessageEmbed } = require('discord.js');
const config = require("../config.json");
// const decodeGif = require('decode-gif');
// const jpeg = require('jpeg-js');

module.exports = client => {
    console.log(" :: LOADED NFSW.JS ")

    client.on("messageCreate", message => {
        if (message.author.bot) return;
        if (message.attachments.map(x => x.proxyURL).length !== 0 && message.attachments.map(x => x.contentType)?.[0]?.split('/')?.[0] !== 'image') return
        if (message.attachments.map(x => x.proxyURL).length == 0 && !message.content.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/)) return;
        let ext = ['ffd8', '8950', /*'4749',*/ '424D'] //  hex code = [jpg, png, gif, bmp]
        try {

            let URL = message.attachments.map(x => x.proxyURL) || message.embeds[0].url;
            if (message.attachments.map(x => x.proxyURL) == 0) {
                let stringURL = message.content.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/)[0]
                URL = stringURL
            }

            async function fn() {
                const pic = await axios.get(`${URL}`, {
                    responseType: 'arraybuffer',
                }).catch(e => console.error(e))

                let start = pic?.data.toString('hex', 0, 2)//.slice(0, 2)
                if (pic?.status === 200) {
                    if (!ext.includes(start)) return console.log('Blocked')
                }

                const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
                // Image must be in tf.tensor3d format
                // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
                /*if (ext.includes('4749')) {
                    const decodedGif = decodeGif(data);
                    const { width, height, frames } = decodedGif;
                    for (const frame of frames) {
                        const frameData = Buffer.from(frame.data);
                        const rawImageData = {
                            data: frameData,
                            width: width,
                            height: height,
                        };
                        // decodeGif returns frames as RGB data
                        // need to convert each frame to an image that TensorFlow can understand
                        const jpegImageData = jpeg.encode(rawImageData);
                        const image = await tensorflow.node.decodeImage(jpegImageData.data, 3);
                        const framePredictions = await model.classify(image);
                        image.dispose(); // do not let this image float around memory
                        const frameClassification = framePredictions.reduce((previous, current) => {
                            return (previous.probability > current.probability) ? previous : current;
                        });

                        // if low confidence then do nothing
                        if (frameClassification.probability < 0.4) continue;

                        // aggressive NSFW check
                        // flag the GIF if ANY NSFW frame is found
                        if (frameClassification.className === 'Porn' || frameClassification.className === 'Hentai' || frameClassification.className === 'Sexy') {
                            predictions = framePredictions;
                            suspectedUrls.push(url); // if suspected as NSFW then track it
                            break; // end the loop if ANY NSFW frame is found
                        }
                    }
                } else {*/
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

                if (valueHentai[1] >= 0.15) {
                    await message.delete().catch(console.error)
                    await message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setTitle("⛔ NSFW Detected")
                            .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                            .setDescription(`➖ **Hentai** = \`${(valueHentai[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`)]
                    })
                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                }
                else if (valuePorn[1] >= 0.55) {
                    await message.delete().catch(console.error)
                    await message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setTitle("⛔ NSFW Detected")
                            .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                            .setDescription(`➖ **Porn** = \`${(valuePorn[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`)]
                    })
                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                }
                /*else if (valueSexy[1] >= 0.7) {
                    await message.delete().catch(console.error)
                    await message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor(config.wrongcolor)
                            .setFooter(config.footertext, config.footericon)
                            .setTitle("⛔ NSFW Detected")
                            .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                            .setDescription(`➖ **Sexy** = \`${(valueSexy[1] * 100).toFixed(2)}\`% \n\n (If it is a misunderstanding, please report it to the Admins)`)]
                    })
                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                }*/
                else {
                    await message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor('#00EB2B')
                            .setFooter(config.footertext, config.footericon)
                            .setTitle("✅ Safe Content")
                            .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: false }))
                            .setDescription(`➖ **Neutral** = \`${(valueNeutral[1] * 100).toFixed(2)}\`% \n ➖ **Drawing** = \`${(valueDrawing[1] * 100).toFixed(2)}\`%`)]
                    })
                        .then(msg => setTimeout(() => msg.delete(), 3000))
                }
            }
            fn()
        } catch (err) {
            console.log(err)
        }
    })
}
