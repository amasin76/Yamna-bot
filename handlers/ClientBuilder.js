const { Client, Collection } = require("discord.js");

module.exports = class YamnaBot extends Client {
    constructor(options) {
        super(options)

        this.commands = new Collection(); // This will store your commands.
        this.cooldowns = new Collection(); // This will store your commands with cooldowns.
        this.aliases = new Collection(); // This will store your alternative commands. Example: /server -> /serverinfo, /guild, /guildinfo
        this.SlashCmds = new Collection();
        this.config = require('../config.json');
        this.package = require("../package.json");
        this.recent = new Set();

    }
}