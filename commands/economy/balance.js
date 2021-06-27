const profileData = require("../../util/eco-profile.js");

exports.run = async (client, message, args) => {
    profile = await profileData(message.author.id, message.guild.id).catch(e => console.error(e.message))
    message.channel.send(`:credit_card: **Your wallet :** \`\`\`js\n${profile.coins}\n\`\`\`\n**🏛 Your Banks :** \`\`\`js\n${profile.bank}\`\`\``);
};
exports.help = {
    name: 'balance'
}
exports.conf = {
    aliases: ["bl"],
    cooldown: 5
}