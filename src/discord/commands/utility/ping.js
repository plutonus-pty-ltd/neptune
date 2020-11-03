module.exports = {
	name: "ping",
	aliases: ["pong, bing"],
	permissions: ["SEND_MESSAGE"],
	cooldown: 5,
	admin: false,

	execute: (client, msg, args) => {
		msg.reply("I'm alive!");
	}
}
