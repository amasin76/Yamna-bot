module.exports = {
    //get a member lol
    getMember: function (message, toFind = "") {
        try {
            toFind = toFind.toLowerCase();
            let target = message.guild.members.cache.get(toFind);
            if (!target && message.mentions.members) target = message.mentions.members.first();
            if (!target && toFind) {
                target = message.guild.members.cache.find((member) => {
                    return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
                });
            }
            return target;
        } catch (e) {
            console.log(e)
        }
    },
    //changeging the duration from ms to a date
    duration: function (ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (60 * 1000)) % 60).toString();
        const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
        const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
        return `\`${days}Days\`,\`${hrs}Hours\`,\`${min}Minutes\`,\`${sec}Seconds\``;
    },
    //function for awaiting reactions
    promptMessage: async function (message, author, time, validReactions) {
        try {
            time *= 1000;
            for (const reaction of validReactions) await message.react(reaction);
            const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
            return message.awaitReactions(filter, {
                max: 1,
                time: time
            }).then((collected) => collected.first() && collected.first().emoji.name);
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    //Function to wait some time
    delay: function (delayInms) {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2);
                }, delayInms);
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    //randomnumber between 0 and x
    getRandomInt: function (max) {
        try {
            return Math.floor(Math.random() * Math.floor(max));
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    //random number between y and x
    getRandomNum: function (min, max) {
        try {
            return Math.floor(Math.random() * Math.floor((max - min) + min));
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    //function for creating a bar
    createBar: function (maxtime, currenttime, size = 25, line = "▬", slider = "🔶") {
        try {
            let bar = currenttime > maxtime ? [line.repeat(size / 2 * 2), (currenttime / maxtime) * 100] : [line.repeat(Math.round(size / 2 * (currenttime / maxtime))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (currenttime / maxtime)) + 1), currenttime / maxtime];
            if (!String(bar).includes("🔶")) return `**[🔶${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
            return `**[${bar[0]}]**\n**${new Date(currenttime).toISOString().substr(11, 8) + " / " + (maxtime == 0 ? " ◉ LIVE" : new Date(maxtime).toISOString().substr(11, 8))}**`;
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    format: function (millis) {
        try {
            let h = Math.floor(millis / 3600000),
                m = Math.floor(millis / 60000),
                s = ((millis % 60000) / 1000).toFixed(0);
            if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
            else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    escapeRegex: function (str) {
        try {
            return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    arrayMove: function (array, from, to) {
        try {
            array = [...array];
            const startIndex = from < 0 ? array.length + from : from;
            if (startIndex >= 0 && startIndex < array.length) {
                const endIndex = to < 0 ? array.length + to : to;
                const [item] = array.splice(from, 1);
                array.splice(endIndex, 0, item);
            }
            return array;
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    secondsToTime: function (sec) {
        try {
            sec = Number(sec);
            let d = Math.floor(sec / 3600 / 24);
            let h = Math.floor(sec % 86400 / 3600);
            let m = Math.floor(sec % 3600 / 60);
            let s = Math.floor(sec % 3600 % 60);

            let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") : "";
            let hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
            let mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
            let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

            return [dDisplay, hDisplay, mDisplay, sDisplay];
        } catch (err) {
            console.log(String(e.stack).bgRed)
        }
    },
    shuffle: function (array) {
        try {
            let currentIndex = array.length, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }

            return array;
        } catch (err) {
            console.log(String(e.stack).bgRed)
        }
    },
    getKeyByValue: function (object, value) {
        try {
            return Object.keys(object).find(key => object[key] === value);
        } catch (e) { console.log(e) }
    },
    humanize_format: function humanize(num) {
        if (typeof (num) == "undefined") return;
        if (num % 100 >= 11 && num % 100 <= 13)
            return num + "th";

        switch (num % 10) {
            case 1: return num + "st";
            case 2: return num + "nd";
            case 3: return num + "rd";
        }
        return num + "th";
    },
    delay: function (delayInms) {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2);
                }, delayInms);
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}