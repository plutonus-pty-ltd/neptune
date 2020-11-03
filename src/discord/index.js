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
			this.Client.on(event, (data) => require(`${__dirname}/events/${event}`)(this.Client, data));
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
					command: command,
					category: category || "other"
				}

				this.commands.set(command.name, struct);
				console.log(`Loaded command ${struct.category} - ${command.name}`);
			} catch {
				console.log(`Command ${struct.category} - ${command.name} failed to load!`);
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
