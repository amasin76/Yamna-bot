exports.run = async (client, message, args, profileData) => {
    message.channel.send(`Your wallet bal is ${profileData.coins}, you banks bal is ${profileData.bank}`);
};
exports.help = {
    name: 'balance'
}
exports.conf = {
    aliases: ["bl"]
}