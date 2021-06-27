const profileModel = require("../../models/profileSchema");
const profileData = require("../../util/eco-profile.js");

exports.run = async (client, message, args) => {
    const amount = args[0];
    profile = await profileData(message.author.id, message.guild.id).catch(e => console.error(e.message))

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Withdrawn amount must be a whole number");

    try {
        if (amount > profile.bank) return message.channel.send(`You don't have that amount of coins to withdraw`);

        await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            },
            {
                $inc: {
                    coins: amount,
                    bank: -amount,
                },
            }
        );

        return message.channel.send(`You withdrew into your wallet :credit_card: :\`\`\`js\n${amount}\n\`\`\``);
    } catch (err) {
        console.log(err);
    }
};
exports.help = {
    name: "withdraw",
    description: "withdraw coins from your bank.",
    usage: "<prefix>withdraw",
    example: "=withdraw"
}

exports.conf = {
    aliases: ["wd"],
    cooldown: 5
}