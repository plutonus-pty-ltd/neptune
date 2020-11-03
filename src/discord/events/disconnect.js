module.exports = (client, event) => {
	switch(event.code) {
		case 1000: {
			console.log("Clean disconnect from Discord");
			break;
		}
		case 4004: {
			throw new Error("An invalid bot token was provided in config.js");
			break;
		}
		default: {
			throw new Error(`Unexpected disconnect: Code ${event.code}`);
			break;
		}
	}
});
