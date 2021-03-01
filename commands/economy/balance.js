exports.run = async (client, message, args, profileData) => {
    message.channel.send(`**💰 Your wallet :** \`${profileData.coins}\`\n**🏛 Your Banks :** \`${profileData.bank}\``);
};
exports.help = {
    name: 'balance'
}
exports.conf = {
    aliases: ["bl"]
}