const premiumSchema = require("../../models/premium")

exports.run = async (client, message, args) => {
    if (message.author.id !== process.env.BOT_OWNER) {
        return message.channel.send(`⛔ This is an developer only command ⛔`).then(msg => msg.delete({ timeout: 20000 }));
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send(`Please specify a valid member`).then(msg => msg.delete({ timeout: 15000 }));

    premiumSchema.findOne(
        {
            User: member.id,
        },
        async (err, data) => {
            if (!data) return message.channel.send(`\`${member.user.username}\` is not exist in the list!`);

            data.delete();
            return message.channel.send(`Removed \`${member.user.username}\` from database!`);
        }
    )
};
exports.help = {
    name: "del-premium",
    description: "delete premium member from database",
    usage: "N/A",
    example: "N/A"
}
exports.conf = {
    aliases: ['-premium'],
    cooldown: 5
}