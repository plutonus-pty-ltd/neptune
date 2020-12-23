
require("dotenv").config();
const express = require("express");
const app = express.Router();
const sa = require("superagent");
const btoa = require("btoa");

module.exports = bot => {
	app.get("/login", (req, res) => {
		res.status(200).redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=identify&prompt=none&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URI)}`);
	});

	app.get("/login/discord", (req, res) => {
		if(!req.query.code) return res.status(401).redirect("/api/login");

		const auth = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

		sa.post("https://discord.com/api/v8/oauth2/token")
			.send({
				grant_type: "authorization_code",
				code: req.query.code,
				redirect_uri: process.env.OAUTH_REDIRECT_URI,
				client_id: process.env.CLIENT_ID,
				scope: "identify"
			})
			.set("Authorization", `Basic ${auth}`)
			.set("Content-Type", "application/x-www-form-urlencoded")
			.then(grant => {
				req.session.access_token = grant.body.access_token;
				req.session.refresh_token = grant.body.refresh_token;
				sa.get("https://discord.com/api/v8/users/@me")
					.set("Authorization", `Bearer ${grant.body.access_token}`)
					.then(user => {
						user = user.body;
						req.session.user = {
							id: user.id,
							username: user.username,
							discriminator: user.discriminator,
							avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
						}
						return res.status(200).redirect("/dashboard");
					}).catch(()=>res.status(400).redirect("/api/login"));
			}).catch(()=>res.status(400).redirect("/api/login"));
	});

	app.get("/logout", (req, res) => {
		req.session.user = undefined;
		res.status(200).redirect("/");
	});

	return app;
}
