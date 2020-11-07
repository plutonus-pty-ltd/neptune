require("dotenv").config();

const fetch = require("node-fetch");
const qs = require("querystring");

const searchurl = "https://www.googleapis.com/youtube/v3/search?";

module.exports = {
	name: "play",
	description: "Add a song to the music queue and play it.",
	aliases: ["addsong"],
	permissions: ["SEND_MESSAGE"],
	cooldown: 5,
	admin: false,

	execute: async (client, msg, args) => {
		const url = await getUrl(args);
		if(!url) return msg.channel.send("I couldn't find that song!");
		console.log(`Added ${song.title} to the queue!`);
	}
}

async function getUrl(args) {
	let id = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/.exec(args[0]);
	if (id) return `https://youtu.be/${id[1]}`;

	const query = qs.stringify({
		part: "snippet",
		q: args.join(" "),
		key: process.env.GOOGLEAPI_KEY
	});

	const { items } = await fetch(`${searchurl}${query}`).then(res => res.json());

	const video = items.find(item => item.id.kind === "youtube#video");
	return video ? `https://youtu.be/${video.id.videoId}` : null;
}
