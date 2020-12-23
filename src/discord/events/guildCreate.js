module.exports = (client, guild) => {
	let settings = client.Client.reqSettings.get(guild.id);
	if(!settings) {
		settings = {
			id: guild.id,
			settings: JSON.stringify({
				welcomeMessage: ""
			})
		}
		client.Client.setSettings.run(settings);
	}
}
