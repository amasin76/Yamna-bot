const config = require("../config.json");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");
//npm i colors
module.exports = client => {
    console.log(" :: LOADED CHATFEATURE.JS ")
    /** @INFO NO PUBLIC VERSION
    */
    let channels = [
        "817149549038272533"
    ]
    client.on("message", message => {
        if (message.author.bot) return;
        if (channels.includes(message.channel.id)) {
            if (message.attachments.size > 0)
                return message.reply("Look at this too...", { files: ["./I_CANNOT_READ_FILES.png"] })
            fetch(`http://api.brainshop.ai/get?bid=${config.b_id}&key=${config.b_key}&uid=1&msg=${encodeURIComponent(message)}`).
                then(res => res.json())
                .then(data => {
                    message.channel.send(data.cnt).catch(e => console.log("ERROR | " + e.stack))
                })
        }
    })
}