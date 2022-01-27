const axios = require('axios');
const { access_api } = process.env;
const player = require('../models/playerSchema')

module.exports = {

    player: async function (userId, userName, pubgName, save) {
        try {
            console.log('try fetch accounId')
            const getPubgId = async (pubgName) => {
                const pubgPlayer = await axios.get(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${pubgName}`, {
                    headers: {
                        'Authorization': `Bearer ${access_api}`,
                        'Accept': 'application/vnd.api+json'
                    }
                })

                if (pubgPlayer.status === 200) {
                    const { data: [{ id: accountId }] } = pubgPlayer.data
                    console.log(pubgName + ' : ' + accountId)
                    return accountId
                }

                throw new Error('Unexpected error')
            }

            if (!save) return await getPubgId(pubgName)


            let result = await player.findOne({ _id: userId })

            if (!result?.pubgId && pubgName) {
                result = new player({
                    _id: userId,
                    userName: userName,
                    pubgId: await getPubgId(pubgName),
                });
                result.save().catch(err => console.log(err));
                console.log('data saved')
            }

            if (result) return result
        } catch (err) {
            return { status: err?.response?.status, ...err?.response?.data?.errors[0] } || err
        }
    }
}