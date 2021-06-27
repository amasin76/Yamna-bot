const profileModel = require("../../models/profileSchema");
const { BOT_OWNER } = process.env;

exports.run = async (client, message, args) => {
    if (message.author.id !== BOT_OWNER) return message.channel.send(`Sorry only <@${BOT_OWNER}> can run this command`);
    if (!args.length) return message.channel.send("You need to mention a player to give them coins");
    const amount = args[0];
    const target = message.mentions.users.first();
    if (!target) return message.channel.send("That user does not exist");

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Deposit amount must be a whole number");

    try {
        const targetData = await profileModel.findOne({ userID: target.id });
        if (!targetData) return message.channel.send(`This user doens't exist in the db`);

        await profileModel.findOneAndUpdate(
            {
                userID: target.id,
            },
            {
                $inc: {
                    coins: amount,
                },
            }
        );

        return message.channel.send(`${target} has been given \`${amount}\` 💰`);
    } catch (err) {
        console.log(err);
    }
};
exports.help = {
    name: "give",
    description: "beg for coins.",
    usage: "<prefix>give",
    example: "=give"
}

exports.conf = {
    aliases: ["beg"],
    cooldown: 5
}