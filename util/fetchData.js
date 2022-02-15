const axios = require('axios');
const { access_api } = process.env;
const player = require('../models/playerSchema')
const InviteModel = require('../models/inviterSchema')

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
    },
    Invites: async function (member, inGuild, invite) {
        try {
            //user quit the quild
            if (!inGuild.state) {
                await InviteModel.updateOne(
                    {
                        //_id: inviter.id,
                        "invitedUsers": { "$elemMatch": { "invitedId": member.id, "available": true } }
                    },
                    {
                        $inc: {
                            'inviter.active': -1,
                        },
                        $set: {
                            'invitedUsers.$[el].available': false,
                            'invitedUsers.$[el].left.kicked': !!inGuild.kicked ? true : false,
                            'invitedUsers.$[el].left.reason': !!inGuild.kicked ? `By: ${inGuild.kicked} | Reason: ${inGuild.reason}` : 'not provide',
                            'invitedUsers.$[el].left.residenceTime': Date.now() - member.joinedTimestamp,
                            'invitedUsers.$[el].highestRole': member.roles?.highest.name,
                        }
                    },
                    {
                        arrayFilters: [{ "el.invitedId": member.id, "el.available": true }],
                    }
                );
                return 'left userData updated'
            }

            const { inviter } = invite

            //intial inviter document's
            const newUser = {
                invitedId: member.id,
                invitedName: member.user.username,
                inGuild: true,
                inviterId: inviter.id,
                highestRoleId: 'basic',
            };



            let result = await InviteModel.findOne({ _id: inviter.id })

            //intial new inviter
            if (!result) {
                result = new InviteModel({
                    _id: inviter.id,
                    inviter: {
                        userId: inviter.id,
                        userName: inviter.tag,
                    },
                });
                await result.save().catch(err => console.log(err));
                console.log('intial inviter data')
            }

            //new user entre the guild
            if (inGuild.state) {
                await InviteModel.updateOne(
                    {
                        _id: inviter.id,
                    },
                    {
                        $inc: {
                            'inviter.total': 1,
                            'inviter.active': 1,
                        },
                        $push: {
                            'invitedUsers': newUser,
                        },
                    }
                );
                return 'new userData updated'
            }
        } catch (err) {
            console.log(err)
        }
    }
}