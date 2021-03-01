const profileModel = require("../../models/profileSchema");

exports.run = async (client, message, args, profileData) => {
    const amount = args[0];
    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Deposit amount must be a whole number");
    try {
        if (amount > profileData.coins) return message.channel.send(`You don't have that amount of coins to deposit`);
        await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            },
            {
                $inc: {
                    coins: -amount,
                    bank: amount,
                },
            }
        );

        return message.channel.send(`You deposited ${amount} of coins into your bank`);
    } catch (err) {
        console.log(err);
    }
};
exports.help = {
    name: "deposit",
    description: "Deposit coins into your bank.",
    usage: "<prefix>deposit",
    example: "=dep"
}

exports.conf = {
    aliases: ["dep"],
    cooldown: 5
}