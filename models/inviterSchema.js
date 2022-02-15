const mongoose = require("mongoose")

const invitedSchema = new mongoose.Schema(
    {
        invitedId: String,
        invitedName: String,
        available: { type: Boolean, default: true },
        inviterId: String,
        highestRole: { type: String, default: '@everyone' },
        joinedAt: { type: Number, default: () => Date.now() },
        left: {
            kicked: { type: Boolean, default: false },
            reason: { type: String, default: 'none' },
            residenceTime: { type: Number, default: 0 },
        }
    },
    {
        timestamps: true
    });

const invitesSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        inviter: {
            userId: String,
            userName: String,
            total: { type: Number, min: 0, default: 0 },
            active: { type: Number, min: 0, default: 0 },
        },
        invitedUsers: [invitedSchema],
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('invites', invitesSchema);