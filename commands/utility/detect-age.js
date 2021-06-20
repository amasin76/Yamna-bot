const axios = require('axios');
const FormData = require('form-data');

exports.run = async (client, message, args) => {
    let startTime = new Date();
    try {
        if (message?.attachments?.size === 0) return message.channel.send(`**Please upload the image**`).then(msg => msg.delete({ timeout: 15000 }));

        let imageURL = message.attachments.map(x => x.proxyURL)?.[0]
        let size = message.attachments.map(x => x.size)?.[0]
        let width = message.attachments.map(x => x.width)?.[0]
        let height = message.attachments.map(x => x.height)?.[0]

        if (size > 3e6) return message.channel.send(`**❌ Max size supported : 3MB**`).then(msg => msg.delete({ timeout: 15000 }));

        const progressMessage = await message.channel.send(`:stopwatch: **Please wait** for processing... [__Resolution__: ${width} x ${height} | __Size__: ${(size / 1e6).toFixed(1)} MB]`);

        const getData = async () => {
            const imageFetch = await axios.get(imageURL, { responseType: 'arraybuffer' })
            const buffer = Buffer.from(imageFetch.data, "utf-8")

            let config = {
                method: 'post',
                url: 'https://api.cloudmersive.com/image/face/detect-age',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Apikey': process.env.CLOUDMERSIVE_API,
                    //...data.getHeaders()
                },
                data: buffer
            };

            const response = await axios(config)
            return response.data
        }
        let ageData = await getData();

        if (progressMessage.deletable) progressMessage.delete();
        if (ageData.PeopleIdentified === 0) return message.channel.send(`**People Identified**: ${ageData.PeopleIdentified}`)

        let endTime = new Date();
        const timeDifference = endTime - startTime

        const embed = new Discord.MessageEmbed()
            .setColor("BLACK")
            .setTitle("DETECT AGE")
            .setThumbnail(`${imageURL || 'https://cdn131.picsart.com/292005232004211.png'}`)
            .setDescription(`\`\`\`Resolution: ${width} x ${height} | Size: ${(size / 1e6).toFixed(1)} MB\`\`\`\n**Accurecy** : ${((ageData.PeopleWithAge[0].AgeClassificationConfidence) * 100).toFixed(1)}%\n**Age Class** : ${ageData.PeopleWithAge[0].AgeClass}\n**Age** : \u200b  ≈${parseInt(ageData.PeopleWithAge[0].Age)}\n\n:stopwatch: : ${parseInt(timeDifference / 1000)}s`)
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        if (message.deletable) message.delete();
        return await message.channel.send(embed)
    } catch (err) {
        console.error(err)
    }
};
exports.help = {
    name: "age",
    description: "Detect age",
    usage: "upload image => type in comment =age",
    example: "upload => =age"
}
exports.conf = {
    aliases: [],
    cooldown: 5
}
/*import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

const form = new FormData();

const processProfileImg = (imageURL, userID) => {
  fetch(imageURL, userID)
    .then((response) => {
      // Use response.body directly, it contains the image right?
      form.append('profileImage', response.body);
      fetch(`https://www.schandillia.com/upload/profile-image?userID=${userID}`, { method: 'POST', body: form })
        .then(response => response.json())
        .then(json => console.log(json));
    });
};
*/