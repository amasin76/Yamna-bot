const profileModel = require("../../models/profileSchema");

exports.run = async (client, message, args, profileData) => {
    let slot1 = ['🍏', '🍑', '🍓'];
    let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let we;
    if (10 > profileData.coins) return message.channel.send(`You don't have that amount of coins to gamble`);
    if (slots1 === slots2 && slots2 === slots3) {
        we = "✨ **Win!** "
        message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
        try {
            const target = message.member;
            const targetData = await profileModel.findOne({ userID: target.id });
            if (!targetData) return message.channel.send(`This user doens't exist in the db`);

            await profileModel.findOneAndUpdate(
                {
                    userID: target.id,
                },
                {
                    $inc: {
                        coins: +1000,
                    },
                }
            );

            //return message.channel.send(`${target} has been given \`${amount}\` 💰`);
            return message.channel.send(`✨${target} You **receive** in your wallet \`+1000\` 💰`);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            we = "❌ **Lose!** "
            message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
            const target = message.member;
            const targetData = await profileModel.findOne({ userID: target.id });
            if (!targetData) return message.channel.send(`This user doens't exist in the db`);

            await profileModel.findOneAndUpdate(
                {
                    userID: target.id,
                },
                {
                    $inc: {
                        coins: -100,
                    },
                }
            );

            //return message.channel.send(`${target} has been given \`${amount}\` 💰`);
            return message.channel.send(`${target} You **lose** from your wallet \`-100\` 💸`);
        } catch (err) {
            console.log(err);
        }
    }
    //message.channel.send(`${slots1} | ${slots2} | ${slots3} - ${we}`)
};
exports.help = {
    name: 'fruit',
    description: "gambling: [bet is 10 if you win: +1000]",
    usage: "<prefix>fruit",
    example: "~fruit"
}
exports.conf = {
    aliases: ["casino", "bet"],
    cooldown: 5
}