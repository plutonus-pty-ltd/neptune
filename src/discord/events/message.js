module.exports = (client, msg) => {
	if(client.isCommand(msg)) {
		console.log(`${msg.author.tag} ran command: ${msg.content.split(/ +/).shift().toLowerCase()}`);
		client.runCommand(msg);
	}
}
