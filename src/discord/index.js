require("dotenv").config();

const fs = require("fs");
const discordjs = require("discord.js");

module.exports = {
	Client: class Client extends discordjs.Client {
		constructor() {
			super();
			this.Client = new discordjs.Client();
			this.categories = [];
			this.commands = new discordjs.Collection();

			return this;
		}

		loadConfig() {
			this.config = require("../data/config").discord;
		}

		getEvents() {
			if(!fs.existsSync(`${__dirname}/events`)) throw new Error("The events directory does not exist!");

			fs.readdir(`${__dirname}/events`, (err, events) => {
				events.forEach(event => {
					event = event.replace(/\.js$/i, "");
					this.registerEvent(event);
				});
			});
		}

		registerEvent(event) {
			this.Client.on(event, (data) => require(`${__dirname}/events/${event}`)(this, data));
			console.log(`Loaded event: ${event}`);
		}

		getCommands() {
			if(!fs.existsSync(`${__dirname}/commands`)) throw new Error("The commands directory does not exist!");

			fs.readdir(`${__dirname}/commands`, (err, categories) => {
				categories.forEach(category => {
					fs.readdir(`${__dirname}/commands/${category}`, (err, commands) => {
						commands.forEach(command => {
							this.registerCommand(require(`${__dirname}/commands/${category}/${command}`), category);
						});
					});
				});
			});
		}

		registerCommand(command, category) {
			if(this.categories.indexOf(category) == -1) this.categories.push(category);
			if(this.commands.get(command.name)) return console.log(`Command ${command.name} already exists!`);

			try {
				const struct = {
					file: command,
					category: category || "other"
				}

				this.commands.set(command.name, struct);
				console.log(`Loaded command ${struct.category} - ${command.name}`);
			} catch {
				console.log(`Command ${struct.category} - ${command.name} failed to load!`);
			}
		}

		isCommand(msg) {
			if(!msg.content.startsWith(this.config.prefix)) return false;

			const cmd = msg.content.slice(this.config.prefix.length).split(/ +/).shift().toLowerCase();
			if(this.commands.has(cmd) || this.commands.find(command => command.file.aliases.includes(cmd))) return true;
			return false;
		}

		runCommand(msg) {
			const args = msg.content.slice(this.config.prefix.length).split(/ +/),
				cmd = args.shift().toLowerCase(),
				command = this.commands.get(cmd) || this.commands.find(command => command.file.aliases.includes(cmd));

			if(command.staff && !msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send("You don't have permission to use that command!");

			try {
				command.file.execute(this.Client, msg, args);
			} catch {
				msg.channel.send("Something went wrong while executing that command!");
				console.log("Something went wrong while executing that command!");
			}
		}

		start() {
			this.loadConfig();
			this.getEvents();
			this.getCommands();

			this.Client.login(process.env.DISCORD_TOKEN);
		}
	}
}
