const profileModel = require("../../models/profileSchema");

exports.run = async (client, message, args, profileData) => {
    const amount = args[0];
    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Withdrawn amount must be a whole number");

    try {
        if (amount > profileData.bank) return message.channel.send(`You don't have that amount of coins to withdraw`);

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

        return message.channel.send(`You withdrew ${amount} of coins into your wallet`);
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