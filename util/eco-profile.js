const profileModel = require("../models/profileSchema");

let profileData = async (user, guild) => {
    try {
        profile = await profileModel.findOne({ userID: user });
        if (!profile) {
            let profile = await profileModel.create({
                userID: user,
                serverID: guild,
                coins: 1000,
                bank: 0,
            });
            profile.save();
        }
    } catch (err) {
        console.log(err);
    };
    return profile
};


module.exports = profileData;