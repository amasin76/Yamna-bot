const config = require("../config.json");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");
//npm i colors
module.exports = client => {
    console.log(" :: LOADED CHAT.JS ")
    /** @INFO NO PUBLIC VERSION
    */
    let channels = [
        "817149549038272533",
        "838159704374378537"
    ]
    const API_URL = 'https://api-inference.huggingface.co/models/r3dhummingbird/DialoGPT-medium-joshua';
    try {
        client.on("message", async message => {
            if (message.author.bot) return;
            if (channels.includes(message.channel.id)) {
                const payload = {
                    inputs: {
                        text: message.content
                    }
                };
                // form the request headers with Hugging Face API key
                const headers = {
                    'Authorization': 'Bearer ' + process.env.HUGGINGFACE_TOKEN
                };
                // set status to typing
                message.channel.startTyping();
                // query the server
                const response = await fetch(API_URL, {
                    method: 'post',
                    body: JSON.stringify(payload),
                    headers: headers
                });
                const data = await response.json();
                let botResponse = '';
                if (data.hasOwnProperty('generated_text')) {
                    botResponse = data.generated_text;
                } else if (data.hasOwnProperty('error')) { // error condition
                    botResponse = data.error;
                }
                // stop typing
                message.channel.stopTyping();
                // send message to channel as a reply
                message.reply(botResponse);

                /*if (message.attachments.size > 0)
                    return message.reply("Look at this too...", { files: ["./I_CANNOT_READ_FILES.png"] })
                fetch(`http://api.brainshop.ai/get?bid=${config.b_id}&key=${config.b_key}&uid=1&msg=${encodeURIComponent(message)}`).
                    then(res => res.json())
                    .then(data => {
                        message.channel.send(data.cnt).catch(e => console.log("ERROR | " + e.stack))
                    })*/
            }
        })
    } catch (err) {
        message.channel.send("ERROR | " + err.stack)
    }
}