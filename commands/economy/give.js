const profileModel = require("../../models/profileSchema");

exports.run = async (client, message, args, profileData) => {
    const randomNumber = Math.floor(Math.random() * 500) + 1;
    const response = await profileModel.findOneAndUpdate(
        {
            userID: message.author.id,
        },
        {
            $inc: {
                coins: randomNumber,
            },
        }
    );
    return message.channel.send(`${message.author.username}, you begged and received ${randomNumber} **coins**`);
};
exports.help = {
    name: 'give'
}
exports.conf = {
    aliases: ["beg"]
}