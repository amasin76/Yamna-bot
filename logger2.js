const db = require('old-wio.db');
const { secondsToTime } = require('./handlers/functions');
const { Permissions } = require('discord.js')

module.exports = (client) => {
    const deleteColor = '#E03A4F'
    const updateColor = 'YELLOW'//'#F5733D'
    const createColor = '#44F641'
    const boostColor = '#EB30DD'
    const footerMsg = 'Beta Logger'
    const thread = '304703193294831617'
    const numberBanMap = new Map()
    let rcl = 0, rdl = 0, cdl = 0, ccl = 0, kl = 0, tl = 1800000;
    try {
        client.on("guildMemberUpdate", async (oldMember, newMember) => {
            const audit = await oldMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(log => log.entries.first());
            const audit_1 = await oldMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${oldMember.guild.id}`)
            if (!logchannel) return;
            let options = {}

            if (options[newMember.guild.id]) {
                options = options[newMember.guild.id]
            }

            // Add default empty list
            if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
            if (typeof options.trackroles === "undefined") options.trackroles = true
            const oldMemberRoles = [...oldMember.roles.cache.keys()]
            const newMemberRoles = [...newMember.roles.cache.keys()]
            const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
            const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))
            const rolechanged = (newRoles.length || oldRoles.length)

            const whiteRoles = ['747860442038272081', '807177719502733353', '717108433572200599', '714058440124923904'] // Comunity, Profile, Streaming now, labo
            const ignoredRoles = whiteRoles.some(role => newRoles.includes(role) || oldRoles.includes('717108433572200599'))

            if (rolechanged && !ignoredRoles) {
                let roleadded = ""
                if (newRoles.length > 0) {
                    for (let i = 0; i < newRoles.length; i++) {
                        if (i > 0) roleadded += ", "
                        roleadded += `${newMember.roles.cache.find(r => r.id == newRoles[i]).name}`
                    }
                }
                let roleremoved = ""
                if (oldRoles.length > 0) {
                    for (let i = 0; i < oldRoles.length; i++) {
                        if (i > 0) roleremoved += ", "
                        roleremoved += `${oldMember.roles.cache.find(r => r.id == oldRoles[i]).name}`
                    }
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Role Changes 〕')
                    .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    ////setFooter(footerMsg, oldMember.guild.iconURL())
                    .addField('Username:', `\`\`\`${oldMember.user.username}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField(roleremoved ? '❌ Role Removed :' : '✅ Role Added :', roleremoved ? `\`\`\`${roleremoved}\`\`\`` : `\`\`\`${roleadded}\`\`\``, true)
                //.setTimestamp();

                let sChannel = oldMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (!oldMember.premiumSince && newMember.premiumSince) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':gem: 〔 Guild Boost 〕')
                    .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(boostColor || 'BLUE')
                    ////setFooter(footerMsg, oldMember.guild.iconURL())
                    .addField('Booster:', `\`\`\`${newMember.user.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = oldMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldMember.premiumSince && !newMember.premiumSince) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':gem: 〔 Guild UnBoost 〕')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(deleteColor || 'BLUE')
                    ////setFooter(footerMsg, newMember.guild.iconURL())
                    .addField('Username:', `\`\`\`${newMember.user.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldMember.user.discriminator !== newMember.user.discriminator) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':level_slider:  〔 Member Tag Update 〕')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    ////setFooter(footerMsg, newMember.guild.iconURL())
                    .addField('Old Tag:', `\`\`\`${oldMember.user.discriminator}\`\`\``, true)
                    .addField('New Tag:', `\`\`\`${newMember.user.discriminator}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldMember.user.username !== newMember.user.username) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':level_slider:  〔 Member Username Update 〕')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    ////setFooter(footerMsg, newMember.guild.iconURL())
                    .addField('Old Username:', `\`\`\`${oldMember.user.username}\`\`\``, true)
                    .addField('New Username:', `\`\`\`${newMember.user.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldMember.nickname !== newMember.nickname) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':level_slider:  〔 Member Nickname Update 〕')
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    ////setFooter(footerMsg, newMember.guild.iconURL())
                    .addField('Old Nickname:', `\`\`\`${oldMember.nickname}\`\`\``, true)
                    .addField('New Nickname:', `\`\`\`${newMember.nickname}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit_1.executor.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldMember.user.avatar !== newMember.user.avatar) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':level_slider:  〔 Member avatar Update 〕')
                    .setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    ////setFooter(footerMsg, newMember.guild.iconURL())
                    .addImage(newMember.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                //.setTimestamp();

                let sChannel = newMember.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
        });

        client.on("emojiCreate", async function (emoji) {
            const audit = await emoji.guild.fetchAuditLogs({ limit: 1, type: "EMOJI_CREATE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${emoji.guild.id}`);
            if (!logchannel) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(':paintbrush: 〔 EMOJI CREATE 〕')
                .setThumbnail(emoji.url || '')
                .setColor(createColor || 'BLUE')
                ////setFooter(footerMsg, emoji.guild.iconURL())
                .addField('Name: ', `\`\`\`${emoji.name}\`\`\``, true)
                .addField('ID: ', `\`\`\`${emoji.id}\`\`\``, true)
                .addField('Executor* :', `\`\`\`${audit.executor.username || 'N/A'}\`\`\``, true)
                .addField('How it looks:', `<${emoji.animateda ? 'a' : ''}:${emoji.name}:${emoji.id}>`, true)
                .addField('Animated: ', `\`\`\`${emoji.animated}\`\`\``, true)
            //.setTimestamp();

            let sChannel = emoji.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("emojiDelete", async function (emoji) {
            const audit = await emoji.guild.fetchAuditLogs({ limit: 1, type: "EMOJI_DELETE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${emoji.guild.id}`);
            if (!logchannel) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(':wastebasket:  〔 EMOJI DELETE 〕')
                .setThumbnail(emoji.url || '')
                .setColor(deleteColor || 'RED')
                ////setFooter(footerMsg, emoji.guild.iconURL())
                .addField('Name: ', `\`\`\`${emoji.name}\`\`\``, true)
                .addField('Animated: ', `\`\`\`${emoji.animated}\`\`\``, true)
                .addField('Executor* :', `\`\`\`${audit.executor.username || 'N/A'}\`\`\``, true)
            //.setTimestamp();

            let sChannel = emoji.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("guildBanAdd", async function (ban) {
            const audit = await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" }).then(log => log.entries.first());

            if (numberBanMap.has(audit.executor.id)) {
                const userData = numberBanMap.get(audit.executor.id)
                const { nBan } = userData
                nBan += 1
                userData.nBan = nBan
                numberBanMap.set(audit.executor.id, userData)
                if (nBan === 5) {
                    let muteRole = await ban.guild.roles.cache.find(role => role.name === "muted")
                    await ban.guild.member(audit.executor.id).roles.set([])
                    await ban.guild.member(audit.executor.id).roles.add(muteRole);
                }
            } else {
                numberBanMap.set(audit.executor.id, { nBan: 1 });
                setTimeout(() => {
                    numberBanMap.delete(audit.executor.id)
                }, 1800000)
            }

            /*const usser = audit.executor
            if (thread == usser.id) {
                let muteRole = await guild.roles.cache.find(role => role.name === "muted")
                await guild.members.cache.get(usser.id).roles.set([])
                await guild.members.cache.get(usser.id).roles.add(muteRole);
            }*/

            let logchannel = db.fetch(`logs_${ban.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':lock:   〔 BAN ADD 〕')
                .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }) || '')
                .setColor(deleteColor || 'RED')
                .addField('Username:', `\`\`\`${ban.user.username}\`\`\``, true)
                .addField('ID:', `\`\`\`js\n${ban.user.id}\n\`\`\``, true)
                .addField('Executor* :', `\`\`\`${audit.executor.username || 'N/A'}\`\`\``, true)
                .addField('Reason :', `\`\`\`${ban?.reason || 'None'}\`\`\``, false)

            let sChannel = ban.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("guildBanRemove", async function (ban) {
            const audit = await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_REMOVE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${ban.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':unlock:   〔 BAN REMOVE 〕')
                .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }) || '')
                .setColor(updateColor || 'BLUE')
                .addField('Username:', `\`\`\`${ban.user.username}\`\`\``, true)
                .addField('ID:', `\`\`\`js\n${ban.user.id}\n\`\`\``, true)
                .addField('Executor* :', `\`\`\`${audit.executor.username || 'N/A'}\`\`\``, true)

            let sChannel = ban.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("guildUpdate", async function (oldGuild, newGuild) {
            const audit = await oldGuild.fetchAuditLogs({ limit: 1, type: "GUILD_UPDATE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${oldGuild.id}`);
            if (!logchannel) return;
            if (!newGuild.available) return;

            if ((oldGuild.afkChannel !== newGuild.afkChannel) || (oldGuild.afkTimeout !== newGuild.afkTimeout)) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Guild afkChannel Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old afkChannel:', `\`\`\`js\n${oldGuild.afkChannel.name} : ${parseInt(oldGuild.afkTimeout / 60)} min\n\`\`\``, true)
                    .addField('New afkChannel:', `\`\`\`js\n${newGuild.afkChannel.name} : ${parseInt(newGuild.afkTimeout / 60)} min\n\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.icon !== newGuild.icon) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Guild afkChannel Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old icon:', `\`\`\`${oldGuild.iconURL({ format: 'png' })}\`\`\``, false)
                    .addField('New icon:', `\`\`\`${newGuild.iconURL({ format: 'png' })}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.description !== newGuild.description) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Guild Description Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Description:', `\`\`\`${oldGuild.description}\`\`\``, false)
                    .addField('New Description:', `\`\`\`${newGuild.description}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            /*if (oldGuild.features !== newGuild.features) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Features Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .setDescription('[more info](https://discord.js.org/#/docs/main/stable/typedef/Features)\n')
                    //setFooter(footerMsg, newGuild.iconURL())
                    .addField('Old Features:', `\`\`\`${oldGuild.features}\`\`\``, false)
                    .addField('New Features:', `\`\`\`${newGuild.features}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    //.setTimestamp();
    
                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({embeds: [embed]}).catch(err => console.log(err))
            }*/
            if (oldGuild.premiumTier !== newGuild.premiumTier) {
                const TIER_0 = '🥰50 Emoji, 🔉96kbps Audio, 📤8MB Upload, \n🎬720p@30fps Stream'
                const TIER_1 = '🥰100 Emoji, 🎫15 Sticker, 🔉128kbps Audio, \n🎨GIF server icon, 📟Invite background, \n📤8MB Upload, 🎬720p@60fps Stream'
                const TIER_2 = '🥰150 Emoji, 🎫30 Sticker, 🔉256kbps Audio, \n🚩Banner Server, 🎨GIF server icon,\n 📟Invite background, 📤50MB Upload, \n🎬1080p@60fps Stream'
                const TIER_3 = '🥰250 Emoji, 🎫60 Sticker, 🔉384kbps Audio, \n🧭Vanity URL, 🚩Banner Server, 🎨GIF server icon, \n📟Invite background, 📤100MB Upload, \n🎬1080p@60fps Stream'

                const embed = new Discord.MessageEmbed()
                    .setTitle(':c: 〔 Guild Premium Tier Update 〕')
                    .setThumbnail('https://i.imgur.com/2SgsN97.png' || newGuild.iconURL({ dynamic: true }))
                    .setColor(boostColor || 'WHITE')
                    .addField('Old Premium Tier :', `\`\`\`${oldGuild.premiumTier}\`\`\``, true)
                    .addField('New Premium Tier :', `\`\`\`${newGuild.premiumTier}\`\`\``, true)
                    .addField('Current Tier Premium Features :', `\`\`\`${newGuild.premiumTier === 1 ? TIER_1 : newGuild.premiumTier === 2 ? TIER_2 : newGuild.premiumTier === 3 ? TIER_3 : TIER_0}\`\`\``, false)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Default Message Notifications Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Features:', `\`\`\`${oldGuild.defaultMessageNotifications}\`\`\``, true)
                    .addField('New Features:', `\`\`\`${newGuild.defaultMessageNotifications}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Explicit Content Filter Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Features:', `\`\`\`${oldGuild.explicitContentFilter}\`\`\``, false)
                    .addField('New Features:', `\`\`\`${newGuild.explicitContentFilter}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.systemChannel !== newGuild.systemChannel) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild System Channel Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Sys Channel :', `\`\`\`${oldGuild.systemChannel?.name || 'No Sys channel'}\`\`\``, true)
                    .addField('New Sys Channel :', `\`\`\`${newGuild.systemChannel?.name || 'No Sys channel'}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Verification Level Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Level :', `\`\`\`${oldGuild.verificationLevel}\`\`\``, true)
                    .addField('New Level :', `\`\`\`${newGuild.verificationLevel}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.banner !== newGuild.banner) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Banner Update 〕')
                    .setThumbnail(newGuild.bannerURL({ dynamic: true, format: 'png' }) || newGuild.iconURL({ dynamic: true }))
                    .setColor(updateColor || 'BLUE')
                    .addField('Old Banner :', `\`\`\`${oldGuild.bannerURL({ dynamic: true, format: 'png' })}\`\`\``, false)
                    .addField('New Banner :', `\`\`\`${newGuild.bannerURL({ dynamic: true, format: 'png' })}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.systemChannelFlags.bitfield !== newGuild.systemChannelFlags.bitfield) {
                let copy_1 = '', copy_2 = '';
                if (newGuild.systemChannelFlags.has('WELCOME_MESSAGE_DISABLED')) {
                    copy_1 = 'WELCOME MESSAGES : :x:'
                } else {
                    copy_1 = 'WELCOME MESSAGES : :white_check_mark: '
                }
                if (newGuild.systemChannelFlags.has('BOOST_MESSAGE_DISABLED')) {
                    copy_2 = 'BOOST MESSAGES : :x:'
                } else {
                    copy_2 = 'BOOST MESSAGES : :white_check_mark: '
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild System Channel Flags Update 〕')
                    .setThumbnail(newGuild.bannerURL({ dynamic: true, format: 'png' }) || newGuild.iconURL({ dynamic: true }))
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, newGuild.iconURL())
                    .setDescription(`Server Settigns > Overview\n___________________\n${copy_1 || ''}\n${copy_2 || ''}`)
                //.setTimestamp();

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldGuild.widgetEnabled !== newGuild.widgetEnabled) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 Guild Widget Enabled Update 〕')
                    .setThumbnail(newGuild.iconURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, newGuild.iconURL())
                    .addField('Old Widget:', `\`\`\`js\n${oldGuild.widgetEnabled}\n\`\`\``, true)
                    .addField('New Widget:', `\`\`\`js\n${newGuild.widgetEnabled}\n\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newGuild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }

        });

        /*client.on("userUpdate", async function (oldUser, newUser) {
            let logchannel = db.fetch(`logs_${oldGuild.id}`);
            if (!logchannel) return;
        });
    
        client.on("guildMemberAdd", function (member) {
            let embedcolor = db.fetch(`logs_embedcolor_${member.guild.id}`);
            let logchannel = db.fetch(`logs_${member.guild.id}`);
            if (!logchannel) return;
            
            const embed = new Discord.MessageEmbed()
                .setAuthor(member.guild.name, member.guild.iconURL())
                .setColor(embedcolor || 'BLACK')
                //setFooter(client.user.username, client.user.avatarURL())
                .setDescription('⚒️ **User joins a guild!**')
                .addField('Username:', `\`\`\`${member.user.username}\`\`\``, true)
                .addField('Discriminator:', `\`\`\`${member.user.discriminator}\`\`\``, true)
                .addField('ID:', `\`\`\`${member.user.id}\`\`\``, false)
                .addField('Created At:', `\`\`\`${member.user.createdAt.toLocaleDateString()}\`\`\``, false)
                .setThumbnail(member.guild.iconURL())
                //.setTimestamp();
        
            let sChannel = member.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({embeds: [embed]})
        });*/

        client.on("guildMemberRemove", async function (member) {
            const log1 = await member.guild.fetchAuditLogs().then(audit => audit.entries.first())
            if (log1.action === "MEMBER_KICK") {
                const log = await member.guild
                    .fetchAuditLogs({
                        limit: 1,
                        type: "MEMBER_KICK"
                    })
                    .then(audit => audit.entries.first());

                const user = log.executor
                if (thread == user.id) {
                    kl += 1
                    if (kl == 5) {
                        let muteRole = await member.guild.roles.cache.find(role => role.name === "muted")
                        await member.guild.members.cache.get(user.id).roles.set([])
                        await member.guild.members.cache.get(user.id).roles.add(muteRole);
                    } else {
                        setTimeout(() => { kl = 0 }, tl)
                    }
                }
            }
            const audit = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_KICK" }).then(log => log.entries.first());
            const duration = parseInt((Date.now() - audit?.createdTimestamp) / 1000)
            const hasKicked = duration < 10
            let logchannel = db.fetch(`logs_${member.guild.id}`);
            //if (thread)
            if (!logchannel) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(':door: 〔 Member Remove 〕')
                .setThumbnail('https://i.imgur.com/2EKVgm5.png')
                .setColor(deleteColor || 'BLUE')
                //setFooter(footerMsg, member.guild.iconURL())
                .addField('Username:', `\`\`\`${member.user.username}\`\`\``, true)
                .addField('ID:', `\`\`\`js\n${member.user.id}\n\`\`\``, false)
                .addField('Join Duration :', `\`\`\`js\n${secondsToTime((Date.now() - member.joinedTimestamp) / 1000)?.[0]}\n\`\`\``, false)
            if (hasKicked) embed.addField('Kicked by:', `\`\`\`fix\n${audit.executor.username} - ${audit.executor.id}\`\`\``, true)

            let sChannel = member.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        });

        client.on("roleCreate", async function (role) {
            const audit = await role.guild.fetchAuditLogs({ limit: 1, type: "ROLE_CREATE" }).then(log => log.entries.first());
            /*const user = audit.executor

            if (thread == user.id) {
                let muteRole = await role.guild.roles.cache.find(role => role.name === "muted")
                await role.guild.members.cache.get(user.id).roles.set([])
                await role.guild.members.cache.get(user.id).roles.add(muteRole);
            }*/

            const user = audit.executor
            if (thread == user.id) {
                rcl += 1
                if (rcl == 2) {
                    let muteRole = await role.guild.roles.cache.find(role => role.name === "muted")
                    await role.guild.members.cache.get(user.id).roles.set([])
                    await role.guild.members.cache.get(user.id).roles.add(muteRole);
                } else {
                    setTimeout(() => { rcl = 0 }, tl)
                }
            }

            let logchannel = db.fetch(`logs_${role.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':paintbrush:  〔 ROLE CREATE 〕')
                .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                .setColor(createColor || 'BLUE')
                .addField('Name :', `\`\`\`${role.name}\`\`\``, true)
                .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                .addField('Mentionable : ', `\`\`\`${role.mentionable}\`\`\``, true)

            let sChannel = role.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        });
        client.on("roleUpdate", async function (oldRole, newRole) {
            const audit = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${newRole.guild.id}`);
            if (!logchannel) return;

            const added = ~oldRole.permissions.bitfield & newRole.permissions.bitfield;
            const removed = oldRole.permissions.bitfield & ~newRole.permissions.bitfield;

            const addedPerms = new Permissions(added).toArray();
            const removedPerms = new Permissions(removed).toArray();
            if (addedPerms.length !== 0 || removedPerms.length !== 0) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE PERMISSIONS UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Role Name :', `\`\`\`${oldRole.name}\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                if (addedPerms.length !== 0) embed.addField(':white_check_mark:Permissions Added : ', `\`\`\`${addedPerms.join("\n")}\`\`\``, false)
                if (removedPerms.length !== 0) embed.addField(':x:Permissions removed : ', `\`\`\`${removedPerms.join("\n")}\`\`\``, false)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            if (oldRole.name !== newRole.name) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE NAME UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Old Name :', `\`\`\`${oldRole.name}\`\`\``, true)
                    .addField('New Name :', `\`\`\`${newRole.name}\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            if (oldRole.position !== newRole.position) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE POSITION UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Old Position :', `\`\`\`${oldRole.position}\`\`\``, true)
                    .addField('New Position :', `\`\`\`${newRole.position}\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Role Name :', `\`\`\`${newRole.name}\`\`\``, true)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            if (oldRole.color !== newRole.color) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE COLOR UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Old Color :', `\`\`\`${oldRole.color}\`\`\``, true)
                    .addField('New Color :', `\`\`\`${newRole.color}\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Role Name :', `\`\`\`${newRole.name}\`\`\``, true)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            if (oldRole.managed !== newRole.managed) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE MANAGED UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Old STATE :', `\`\`\`js\n${oldRole.managed}\n\`\`\``, true)
                    .addField('New STATE :', `\`\`\`js\n${newRole.managed}\n\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Role Name :', `\`\`\`${newRole.name}\`\`\``, true)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            if (oldRole.mentionable !== newRole.mentionable) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE MENTIONABLE UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .addField('Old STATE :', `\`\`\`js\n${oldRole.mentionable}\n\`\`\``, true)
                    .addField('New STATE :', `\`\`\`js\n${newRole.mentionable}\n\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Role Name :', `\`\`\`${newRole.name}\`\`\``, true)

                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }
            /*} else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench: 〔 ROLE UPDATE 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'YELLOW')
                    .setDescription('Role have been updated\n-check audit for more info')
                    .addField('Role Name :', `\`\`\`${newRole.name}\`\`\``, true)
                    .addField('Role ID :', `\`\`\`${newRole.id}\`\`\``, true)
                    .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
 
                let sChannel = newRole.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] })
            }*/
        });
        client.on("roleDelete", async function (role) {
            const audit = await role.guild.fetchAuditLogs({ limit: 1, type: "ROLE_DELETE" }).then(log => log.entries.first());

            const user = audit.executor
            if (thread == user.id) {
                rdl += 1
                if (rdl == 2) {
                    let muteRole = await role.guild.roles.cache.find(role => role.name === "muted")
                    await role.guild.members.cache.get(user.id).roles.set([])
                    await role.guild.members.cache.get(user.id).roles.add(muteRole);
                } else {
                    setTimeout(() => { rdl = 0 }, tl)
                }
            }

            let embedcolor = deleteColor;
            let logchannel = db.fetch(`logs_${role.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':wastebasket: 〔 ROLE DELETE 〕')
                .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                .setColor(deleteColor || 'RED')
                //setFooter(footerMsg, role.guild.iconURL())
                //.setDescription('⚒️ **Role got created!**')
                .addField('Name :', `\`\`\`${role.name}\`\`\``, true)
                .addField('Executor :', `\`\`\`${audit.executor.username}\`\`\``, true)
                .addField('Mentionable : ', `\`\`\`${role.mentionable}\`\`\``, true)
            //.setTimestamp();

            let sChannel = role.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        });

        client.on("channelCreate", async (channel) => {
            if (channel.parentId === '838808732153675837') return;
            const audit = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" }).then(log => log.entries.first());

            const user = audit.executor
            if (thread == user.id) {
                ccl += 1
                if (ccl == 5) {
                    let muteRole = await channel.guild.roles.cache.find(role => role.name === "muted")
                    await channel.guild.members.cache.get(user.id).roles.set([])
                    await channel.guild.members.cache.get(user.id).roles.add(muteRole);
                } else {
                    setTimeout(() => { ccl = 0 }, tl)
                }
            }

            const logchannel = db.fetch(`logs_${channel.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':paintbrush: 〔 Channel Create 〕')
                .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                .setColor(createColor || 'BLUE')
                //setFooter(footerMsg, channel.guild.iconURL())
                .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                .addField('Channel Name:', `<#${channel.id}>`, true)
                .addField('Channel Type:', `\`\`\`${channel.type}\`\`\``, true)
            //.setTimestamp();

            let sChannel = channel.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("channelUpdate", async (oldChannel, newChannel) => {
            if (channel.parentId === '838808732153675837') return;
            const audit = await oldChannel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" }).then(log => log.entries.first());
            const embedcolor = createColor;
            const logchannel = db.fetch(`logs_${oldChannel.guild.id}`);
            if (!logchannel) return;
            if (oldChannel.name != newChannel.name) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel Name Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, oldChannel.guild.iconURL())
                    .addField('Old Name:', `\`\`\`${oldChannel.name}\`\`\``, true)
                    .addField('New Name:', `\`\`\`${newChannel.name}\`\`\``, true)
                    .addField('Tag Name:', `<#${newChannel.id}>`, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Type:', `\`\`\`${newChannel.type}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (oldChannel.type != newChannel.type) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel Type Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, oldChannel.guild.iconURL())
                    .addField('Old Type:', `\`\`\`${oldChannel.type}\`\`\``, true)
                    .addField('New Type:', `\`\`\`${newChannel.type}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Name :', `\`\`\`${newChannel.name}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (oldChannel.topic != newChannel.topic) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel Topic Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, oldChannel.guild.iconURL())
                    .addField('Old Topic:', `\`\`\`${oldChannel.topic}\`\`\``, false)
                    .addField('New Topic:', `\`\`\`${newChannel.topic}\`\`\``, false)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Name :', `\`\`\`${newChannel.name}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (newChannel.type === 'GUILD_VOICE' && oldChannel.bitrate !== newChannel.bitrate) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel Bitrate Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    //setFooter(footerMsg, oldChannel.guild.iconURL())
                    .addField('Old Bitrate:', `\`\`\`js\n${parseInt(oldChannel.bitrate / 1000)} Kbps\n\`\`\``, true)
                    .addField('New Bitrate:', `\`\`\`js\n${parseInt(newChannel.bitrate / 1000)} kbps\n\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Name:', `\`\`\`${newChannel.name}\`\`\``, true)
                //.setTimestamp();

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (newChannel.type === 'GUILD_VOICE' && oldChannel.userLimit !== newChannel.userLimit) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel User Limit Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old User Limit:', `\`\`\`js\n${oldChannel.userLimit}\n\`\`\``, true)
                    .addField('New User Limit:', `\`\`\`js\n${newChannel.userLimit}\n\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Name :', `\`\`\`${newChannel.name}\`\`\``, true)

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (newChannel.type === 'GUILD_TEXT' && oldChannel.nsfw !== newChannel.nsfw) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel isNSFW Update 〕')
                    .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Old STATE:', `\`\`\`js\n${oldChannel.nsfw}\n\`\`\``, true)
                    .addField('New STATE:', `\`\`\`js\n${newChannel.nsfw}\n\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                    .addField('Channel Name :', `\`\`\`${newChannel.name}\`\`\``, true)

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            else if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {

                const oldAllowed = await oldChannel.permissionOverwrites.cache.filter(e => !newChannel.permissionOverwrites.cache.find(a => a.allow.bitfield == e.allow.bitfield));
                const oldDenyed = await oldChannel.permissionOverwrites.cache.filter(e => !newChannel.permissionOverwrites.cache.find(a => a.deny.bitfield == e.deny.bitfield));
                const newAllowed = await newChannel.permissionOverwrites.cache.filter(e => !oldChannel.permissionOverwrites.cache.find(a => a.allow.bitfield == e.allow.bitfield));
                const newDenyed = await newChannel.permissionOverwrites.cache.filter(e => !oldChannel.permissionOverwrites.cache.find(a => a.deny.bitfield == e.deny.bitfield));

                const added = oldAllowed.map(e => newAllowed.map(a => ~e.allow.bitfield & a.allow.bitfield));
                //console.log(added)
                const removed = oldDenyed.map(e => newDenyed.map(a => ~e.deny.bitfield & a.deny.bitfield));
                //console.log(removed)

                const addedPerms = await new Permissions(added).toArray();
                //console.log(addedPerms)
                const removedPerms = await new Permissions(removed).toArray();
                //console.log(removedPerms)

                const permsType = oldAllowed.first()?.type || oldDenyed.first()?.type
                const target = permsType === 'role'
                    ? newChannel.guild.roles.cache.get(newAllowed.first()?.id)?.name
                    : newChannel.guild.members.cache.get(newAllowed.first()?.id)?.user.username

                const embed = await new Discord.MessageEmbed()
                    .setTitle(':wrench:  〔 Channel Permissions Update 〕')
                    .setThumbnail(audit?.executor?.displayAvatarURL({ dynamic: true }) || '')
                    .setColor(updateColor || 'BLUE')
                    .addField('Channel Name:', `\`\`\`${newChannel.name}\`\`\``, true)
                    .addField('Executor:', `\`\`\`${audit?.executor?.username}\`\`\``, true)
                    .addField('\u200b', '\u200b', true)
                    .addField('Type:', `\`\`\`${permsType || 'Not Found'}\`\`\``, true)
                    .addField('Target:', `\`\`\`${target || 'Not Found'}\`\`\``, true)
                    .addField('\u200b', '\u200b', true)
                if (addedPerms.length !== 0) embed.addField(':white_check_mark:Permissions Added : ', `\`\`\`${addedPerms.join(",\n")}\`\`\``, false)
                if (removedPerms.length !== 0) embed.addField(':x:Permissions removed : ', `\`\`\`${removedPerms.join(",\n")}\`\`\``, false)
                if (addedPerms.length == 0 && removedPerms.length == 0) embed.addField(':x:Permissions removed : ', `\`\`\`DEFAULT\`\`\``, false)
                if (!permsType && !target) embed.addField('New Overrides : ', `\`\`\`more info check audit log\`\`\``, false)

                let sChannel = newChannel.guild.channels.cache.get(logchannel)
                if (!sChannel) return;
                sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
            }

        });

        client.on("channelDelete", async (channel) => {
            if (channel.parentId === '838808732153675837') return;
            const audit = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_DELETE" }).then(log => log.entries.first());

            const user = audit.executor
            if (thread == user.id) {
                cdl += 1
                if (cdl == 2) {
                    let muteRole = await channel.guild.roles.cache.find(role => role.name === "muted")
                    await channel.guild.members.cache.get(user.id).roles.set([])
                    await channel.guild.members.cache.get(user.id).roles.add(muteRole);
                } else {
                    setTimeout(() => { cdl = 0 }, tl)
                }
            }

            const logchannel = db.fetch(`logs_${channel.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':wastebasket:〔 Channel Delete 〕')
                .setThumbnail(audit.executor.displayAvatarURL({ dynamic: true }) || '')
                .setColor(deleteColor || 'BLUE')
                .addField('Name:', `\`\`\`${channel.name}\`\`\``, true)
                .addField('Type:', `\`\`\`${channel.type}\`\`\``, true)
                .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)

            let sChannel = channel.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("channelPinsUpdate", async (channel, time) => {
            const audit = await channel.guild.fetchAuditLogs({ limit: 1, type: "MESSAGE_PIN" }).then(log => log.entries.first());
            const logchannel = db.fetch(`logs_${channel.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':pushpin: 〔 Channel Pins Update 〕')
                .setThumbnail('https://i.imgur.com/qubMpPG.png')
                .setColor(createColor || 'BLUE')
                //setFooter(footerMsg, channel.guild.iconURL())
                .addField('Executor:', `\`\`\`${audit.executor.username}\`\`\``, true)
                .addField('Channel Name:', `<#${channel.id}>`, true)
                .addField('Pinned at:', `\`\`\`${Intl.DateTimeFormat('en-GB', { timeStyle: 'long' }).format(time)}\`\`\``, true)
            //.setTimestamp();

            let sChannel = channel.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("messageUpdate", (oldMessage, newMessage) => {
            if (oldMessage.channel.type !== "text") return;
            if (newMessage.channel.type !== "text") return;
            if (oldMessage.content == newMessage.content) return;
            if (oldMessage.author.bot) return;
            if (!oldMessage.guild) return;
            let logchannel = db.fetch(`logs_${oldMessage.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':level_slider: 〔 MESSAGE Update 〕')
                .setThumbnail('https://i.imgur.com/Xkaiwb6.png')
                .setColor(updateColor || 'YELLOW')
                //setFooter(footerMsg, oldMessage.guild.iconURL())
                .setDescription(`**Old Message** :\n\`\`\`${oldMessage.content}\`\`\`\n**New Message** :\n\`\`\`${newMessage.content}\`\`\``)
                .addField('Author :', `\`${oldMessage.author.username}\``, true)
                .addField('Sent in :', `<#${oldMessage.channel.id}>`, true)
            //.addField('\u200B', '\u200B', false)
            //.setTimestamp();

            let sChannel = oldMessage.guild.channels.cache.get(logchannel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("messageDelete", async function (message) {
            const audit = await message.guild.fetchAuditLogs({ limit: 1, type: "MESSAGE_DELETE" }).then(log => log.entries.first());
            const duration = parseInt((Date.now() - audit.createdTimestamp) / 1000)
            if (message.author.bot) return;
            if (duration <= 20) {
                if (audit.executor.id === message.guild.id) return;
                if (audit.executor.id === '484524591696576523'/*process.env.BOT_OWNER*/) return;
            }
            if (message.author.bot) return;
            if (!message.guild) return;
            let logchannel = db.fetch(`logs_${message.guild.id}`);
            if (!logchannel) return;

            if (message.attachments.first()) {
                const rawName = message.attachments.first().name
                const { contentType } = message.attachments.first()
                const extention = rawName.slice((rawName.lastIndexOf(".") - 1 >>> 0) + 2)
                const fileName = rawName.split('.')?.[0]
                const isImage = (['png', 'jpg', 'gif', 'jpeg', 'webp']).includes(extention)
                if (isImage) {
                    const imageAttachment = await new Discord.MessageAttachment(message.attachments.first().proxyURL, `${fileName}.${extention}`)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(':wastebasket: 〔 MESSAGE DELETE 〕')
                        .setColor(deleteColor || 'RED')
                        .setDescription(message.content.length !== 0 ? `**Content** :\n\`\`\`${message.content}\`\`\`` : "")
                        .addField('Sent by :', `\`${message.author.username}\``, true)
                        .addField('Sent in :', `<#${message.channel.id}>`, true)
                        .addField('Executor :', `\`${duration <= 20 ? audit.executor.username : 'Not Found'}\``, true)
                        //.attachFiles(imageAttachment)
                        .setImage(`attachment://${fileName}.${extention}`)

                    let sChannel = message.guild.channels.cache.get(logchannel)
                    if (!sChannel) return;
                    sChannel.send({ embeds: [embed], files: [imageAttachment] }).catch(err => console.log(err))
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(':wastebasket: 〔 MESSAGE DELETE 〕')
                        .setColor(deleteColor || 'RED')
                        .setDescription(message.content.length !== 0 ? `**Content** :\n\`\`\`${message.content}\`\`\`` : "")
                        .addField('Sent by :', `\`${message.author.username}\``, true)
                        .addField('Sent in :', `<#${message.channel.id}>`, true)
                        .addField('Executor :', `\`${duration <= 20 ? audit.executor.username : 'Not Found'}\``, true)
                        .addField('File Name :', `\`\`\`${rawName}\`\`\``, true)
                        .addField('File Type :', `\`\`\`${contentType}\`\`\``, true)

                    let sChannel = message.guild.channels.cache.get(logchannel)
                    if (!sChannel) return;
                    sChannel.send({ embeds: [embed] }).catch(err => console.log(err))
                }
            } else {
                let isImageURL = message.content.match(/(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp|gif|tiff|bmp)/gi)
                const embed = new Discord.MessageEmbed()
                    .setTitle(':wastebasket: 〔 MESSAGE DELETE〕')
                    .setThumbnail('https://i.imgur.com/UgMg9cq.png')
                    .setColor(deleteColor || 'RED')
                    .setDescription(`**Content** :\n\`\`\`${message.content || "I can't get message data (It was embed)"}\`\`\``)
                    .addField('Sent by :', `\`${message.author.username}\``, true)
                    .addField('Sent in :', `<#${message.channel.id}>`, true)
                    .addField('Executor :', `\`${duration <= 20 ? audit.executor.username : 'Not Found'}\``, true)
                    .setImage(isImageURL?.[0] || '')

                let s1Channel = message.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
        });
        ///////////////=-=-=-=-=-=-=-=-=
        client.on("voiceStateUpdate", async (oldState, newState) => {
            const audit = await newState.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" }).then(log => log.entries.first());
            let logchannel = db.fetch(`logs_${newState.guild.id}`);
            if (!logchannel) return;

            if (!oldState.serverMute && newState.serverMute) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':microphone2:  〔 Member Server Mute 〕')
                    .setThumbnail("https://i.imgur.com/NjyzuV9.png")
                    .setColor(deleteColor || 'RED')
                    //setFooter(footerMsg, newState.guild.iconURL())
                    .addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                    .addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                    .addField('Executor* :', `\`\`\`${audit.executor.username || "N/A"}\`\`\``, true)
                //.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldState.serverMute && !newState.serverMute) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':microphone2:  〔 Member Server UnMute 〕')
                    .setThumbnail("https://i.imgur.com/WH9MOR9.png")
                    .setColor(createColor || 'RED')
                    //setFooter(footerMsg, newState.guild.iconURL())
                    .addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                    .addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                    .addField('Executor* :', `\`\`\`${audit.executor.username || "N/A"}\`\`\``, true)
                //.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (!oldState.serverDeaf && newState.serverDeaf) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':mute: 〔 Member Server Deaf 〕')
                    .setThumbnail("https://i.imgur.com/oa8XVEs.png")
                    .setColor(deleteColor || 'RED')
                    //setFooter(footerMsg, newState.guild.iconURL())
                    .addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                    .addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                    .addField('Executor* :', `\`\`\`${audit.executor.username || "N/A"}\`\`\``, true)
                //.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (oldState.serverDeaf && !newState.serverDeaf) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':sound: 〔 Member Server UnDeaf 〕')
                    .setThumbnail("https://i.imgur.com/IvOr2js.png")
                    .setColor(createColor || 'RED')
                    //setFooter(footerMsg, newState.guild.iconURL())
                    .addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                    .addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                    .addField('Executor* :', `\`\`\`${audit.executor.username || "N/A"}\`\`\``, true)
                //.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            if (!oldState.selfVideo && newState.selfVideo) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(':camera_with_flash: 〔 Member Camera ON 〕')
                    .setThumbnail("https://i.imgur.com/tPUeI4E.png")
                    .setColor(createColor || 'RED')
                    //setFooter(footerMsg, newState.guild.iconURL())
                    .addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                    .addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                //.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
            }
            /*if (!oldState.streaming && newState.streaming) {
                const embed = new Discord.MessageEmbed()
                    //.setTitle(':red_circle:   〔 Member Stream ON 〕')
                    //.setThumbnail("https://i.imgur.com/XYeqtsd.png")
                    .setColor(createColor || 'RED')
                    ////setFooter(footerMsg, newState.guild.iconURL())
                    .setDescription(`:red_circle: \`${newState.member.displayName}\` Streaming in <#${newState.channel.id}>`)
                //.addField('User :', `\`\`\`${newState.member.displayName}\`\`\``, true)
                //.addField('Voice Channel :', `<#${newState.channel.id}>`, true)
                ////.setTimestamp();

                let s1Channel = newState.guild.channels.cache.get(logchannel)
                if (!s1Channel) return;
                s1Channel.send({embeds: [embed]}).catch(err => console.log(err))
            }*/
        });

        client.on("inviteCreate", async (invite) => {
            let logchannel = db.fetch(`logs_${invite.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':love_letter: 〔 Invite Server Create 〕')
                .setThumbnail("https://i.imgur.com/DCfHDLz.png")
                .setColor(createColor || 'RED')
                //setFooter(footerMsg, invite.guild.iconURL())
                .addField('Code :', `\`\`\`${invite.code}\`\`\``, true)
                .addField('Channel :', `\`\`\`${invite.channel.name}\`\`\``, true)
                .addField('Inviter :', `\`\`\`${invite.inviter.username}\`\`\``, true)
                .addField('Max Age :', `\`\`\`js\n${invite.maxAge === 0 ? 'Unlimited' : secondsToTime(invite.maxAge)?.[0]}\n\`\`\``, true)
                .addField('Max Uses :', `\`\`\`js\n${invite.maxUses === 0 ? 'Unlimited' : invite.maxUses}\n\`\`\``, true)
                .addField('Expires At :', `\`\`\`js\n${Intl.DateTimeFormat('en-GB', { /*weekday: 'long',*/ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'UTC' }).format(invite.expiresAt)}\n\`\`\``, true)
            //.setTimestamp();

            let s1Channel = invite.guild.channels.cache.get(logchannel)
            if (!s1Channel) return;
            s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
        });

        client.on("inviteDelete", async (invite) => {
            const log1 = await invite.guild.fetchAuditLogs().then(audit => audit.entries.first())
            let log = null
            if (log1.action === "INVITE_DELETE") {
                log = await invite.guild
                    .fetchAuditLogs({
                        type: "INVITE_DELETE"
                    })
                    .then(audit => audit.entries.first());
            }
            let logchannel = db.fetch(`logs_${invite.guild.id}`);
            if (!logchannel) return;

            const embed = new Discord.MessageEmbed()
                .setTitle(':love_letter: 〔 Invite Server Delete 〕')
                .setThumbnail("https://i.imgur.com/DCfHDLz.png")
                .setColor(deleteColor || 'RED')
                .addField('code :', `\`\`\`${invite.code}\`\`\``, true)
                .addField('Channel :', `\`\`\`${invite.channel.name}\`\`\``, true)
                .addField('Executor :', `\`\`\`${log ? log.executor.username : 'Expired'}\`\`\``, true)

            let s1Channel = invite.guild.channels.cache.get(logchannel)
            if (!s1Channel) return;
            s1Channel.send({ embeds: [embed] }).catch(err => console.log(err))
        });
    } catch (err) {
        console.log(err)
    }
}
