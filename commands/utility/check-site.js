const axios = require('axios');

exports.run = async (client, message, args, prefix) => {
    const url = args[0]

    if (!url) return message.channel.send(`**Please provide a URL**`).then(msg => msg.delete({ timeout: 15000 }));

    if (!url.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/m)) {
        return message.channel.send(`**Please provide an valid URL**`).then(msg => msg.delete({ timeout: 15000 }));
    }

    try {
        const response = await axios(url)

        if (response.status !== 200) return message.channel.send(":x: Looks like this website is down...")

        return message.channel.send("✅ This website is up and running!")

    } catch (err) {
        return message.channel.send(`:x: Looks like this website is down...`)
    }
}
exports.help = {
    name: "check-website",
    description: "Check website is running or down",
    usage: '<prefix>website <URL>',
    example: '=website https://sunnah.com/'
}
exports.conf = {
    aliases: ["checkwebsite", "cweb"],
    cooldown: 5
}