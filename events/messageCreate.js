const Discord = require("discord.js"), cooldowns = new Discord.Collection() //db = require("quick.db");
// cooldowns will store the user when they are still in the cooldown mode.
const { MessageEmbed } = require('discord.js');
const getprefix = require("../util/getprefix");
const config = require("../config.json");
const premiumSchema = require("../models/premium")

module.exports = async (client, message) => {
    // Prevent any chit-chats with other bots, or by himself.
    if (message.author.bot || message.author === client.user) return;

    //let prefix = client.config.prefix;
    let prefix = await getprefix(message.guild.id);

    //Mention
    botMentioned = message.content.includes('<@!807868627302350868>') || message.content.includes('<@807868627302350868>');
    if (botMentioned && message.author.id == process.env.BOT_OWNER) message.channel.send("**💖 سمعـــــا و طاعـــــة 💖**");
    if (botMentioned && message.author.id != process.env.BOT_OWNER) {
        message.reply(`\` My Custom Prefix: 【 ${prefix} 】 || Default: 【 = 】\`\n`)
    }//(message.mentions.has(client.user)

    let inviteLink = ["discord.gg/", "discord.com/invite", "discordapp.com/invite"];

    if (inviteLink.some(word => message.content.toLowerCase().includes(word))) {
        await message.delete();
        return message.channel.send("Bro, you can't promote your server here!")
            .then(m => m.delete({ timeout: 30 * 1000 }))
    }

//     let shareLinks = ["twitch.tv/", "younube.com/", "youtu.be/"]
//     let whiteChannel = ["746777186714779770", "717058723692019772"]
//     try {
//         if (message.author.bot) return;
//         if (message.channel.id == '749584245457944577' && message.content.toLowerCase().includes('twitch')) return;
//         if (!whiteChannel.includes(message.channel.id) && shareLinks.some(word => message.content.toLowerCase().includes(word))) {
//             await message.delete();
//             return await message.channel.send(new MessageEmbed()
//                 .setColor(config.wrongcolor)
//                 .setFooter(config.footertext, message.author.displayAvatarURL({ format: 'png', dynamic: false }))
//                 .setTitle("⛔ Violation of Rules")
//                 .setDescription(`__Channels Category__ (check <#714787304862122104>) \n\n \`Please use the correct channel for the topic you are posting about\` \n\n You can post Links in <#746777186714779770> or Clips in <#749584245457944577>`))
//                 .then(msg => msg.delete({ timeout: 30 * 1000 }))
//         }
//     } catch (err) {
//         console.log(err)
//     }

    try {
        const msg = message.content.toLowerCase()
        let isTextMatched = /@everyone|@here/i.test(msg) && /\//i.test(msg)
        let hasPermission = message.member.permissions.has('MOVE_MEMBERS')
        if (isTextMatched && !hasPermission) {
            //let muteRole = await message.guild.roles.cache.find(role => role.name === "muted")
            await message.member.timeout(7 * 24 * 60 * 60 * 1000, "Potential Scammer")
            message?.delete()
        }
    } catch (err) {
        console.log(err)
    }

    // Verification Site
    /*if (message.channel.id === "CHANNEL ID") { // Verification Text Channel
        // Re-send Code System
        if (message.content.startsWith("resend")) {
            let code = db.get(`verification.${message.author.id}`);
            await message.delete();
            const dm = new Discord.MessageEmbed()
                .setColor(0x7289DA)
                .setTitle(`Welcome to ${message.guild.name}!`)
                .setDescription("Hello! Before you get started, I just want you to verify yourself first.")
                .addField("Put your code into the channel.", `**This is your code:** ${code}`)
            await message.author.send(dm).catch(() => {
                return message.reply("Your DM is still locked. Unlock your DM first.")
                    .then(i => i.delete({ timeout: 10000 }));
            })
 
            return message.reply("Check your DM.").then(i => i.delete({ timeout: 10000 }));
        }
 
        // Verify System
        if (!client.config.owners.includes(message.author.id)) { // The owner of the bot cannot get any verification codes.
            if (!message.author.bot) { // If the user was a robot, well return it.
                let verify = parseInt(message.content);
                let code = db.get(`verification.${message.author.id}`);
                if (verify !== code) {
                    // If the code that user insert it doesn't the same with the database, return it.
                    message.delete()
                    return message.reply("Are you sure that is the code that you typing it?").then(i => i.delete({ timeout: 10000 }));
                }
 
                if (verify === code) {
                    message.delete();
                    db.delete(`verification.${message.author.id}`);
                    message.reply("You are not a robot! Please wait, 5 seconds okay?").then(i => i.delete({ timeout: 7500 }));
                    setTimeout(function () {
                        message.member.roles.add("ROLE_ID");
                        // Use .roles.remove if you wanna remove the role after verification.
                    }, 5000)
                }
            }
        }
    }*/
    client.emit('experience', message);

    // If the user doesn't doing any to the bot, return it.
    //blacklist
    const blacklist = require('../models/blacklistSchema')
    /*if (!message.content.startsWith(prefix)) return;
    blacklist.findOne({ id: message.author.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            let msg = message.content.toLowerCase();
            let cmd = args.shift().toLowerCase();
            let sender = message.author;
        } else {
            message.channel.send('You are blacklisted!')
        }
    });*/
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.author;

    let blist = await blacklist.findOne({ id: message.author.id, })
    try {
        if (blist && message.content.startsWith(prefix)) {
            console.log(`${message.author.tag} (${message.author.id}) Got Blocked ${message.content} `);
            return message.reply("You are blacklisted from the BOT!")
        }
    } catch (err) {
        console.log(err);
    }

    // Many people don't know what is message.flags.
    // We've already seen a bot who has a message.flags or they would called, parameter things.
    message.flags = []
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1)); // Example: /play -soundcloud UP pice
    }

    let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return; // If the commands doesn't exist, ignore it. Don't send any warning on this.

    if (!message.member.permissions.has(commandFile.conf.userPermissions || [])) return message.channel.send({
        embed: {
            "description": `⛔ You don't have required permission(s): \`${commandFile.conf.userPermissions.join(", ") || "N/A"}\``, "color": 0xff2050
        }
    }).then(msg => msg.delete({ timeout: 15000 }));
    if (!message.guild.me.permissions.has(commandFile.conf.mePermissions || [])) return message.channel.send(`I don't have permission(s): \`${commandFile.conf.mePermissions.join(", ") || ""}\``)

    if (commandFile.conf.premium) {
        if (!(await premiumSchema.findOne({ User: message.author.id }))) {
            return message.channel.send("💝 You need upgrade to premium tier for use this command")
        }
    }

    // This will set a cooldown to a user after typing a command.
    if (!cooldowns.has(commandFile.help.name)) cooldowns.set(commandFile.help.name, new Discord.Collection());

    const member = message.member,
        now = Date.now(),
        timestamps = cooldowns.get(commandFile.help.name),
        cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

    if (!timestamps.has(member.id)) {
        if (!client.config.owners.includes(message.author.id)) {
            // If the user wasn't you or other owners that stored in config.json
            timestamps.set(member.id, now);
        }
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Cooldown, please wait **${timeLeft.toFixed(1)}** seconds to try the command again.`);
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount); // This will delete the cooldown from the user by itself.
    }

    try {
        if (!commandFile) return;
        commandFile.run(client, message, args, prefix);
    } catch (error) {
        console.log(error.message);
    } finally {
        // If you want to really know, who is typing or using your bot right now.
        console.log(`${sender.tag} (${sender.id}) ran a command: ${cmd}`);
    }
}
