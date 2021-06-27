const profileModel = require("../../models/profileSchema");
const profileData = require("../../util/eco-profile.js");

exports.run = async (client, message, args) => {
    const amount = args[0];
    const profile = await profileData(message.author.id, message.guild.id).catch(e => console.error(e.message))

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Deposit amount must be a whole number");
    try {
        if (amount > profile.coins) return message.channel.send(`You don't have that amount of coins to deposit`);
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

        return message.channel.send(`You deposited into your bank :classical_building: :\`\`\`js\n${amount}\n\`\`\``);
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