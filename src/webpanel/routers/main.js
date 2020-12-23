const express = require("express");
const app = express.Router();

module.exports = bot => {
	const data = require("../helpers/interactions")(bot);

	app.get("/", (req, res) => {
		return res.status(200).render("home", { title: "Home", user: req.session.user });
	});



	// All other routes are for logged in users only
	app.use("/dashboard", (req, res, next) => {
		if(!req.session.user) return res.status(401).redirect("/api/login");
		next();
	});

	app.get("/dashboard", (req, res) => {
		res.status(200).render("dashboard", { title: "Dashboard", user: req.session.user, guilds: data.getGuildsMemberIsAdmin(req.session.user.id) });
	});

	app.get("/dashboard/:guild", (req, res) => {
		res.status(200).render("guildDashboard", { title: data.getGuildInfo(req.params.guild).name, user: req.session.user, settings: data.getSettings(req.params.guild), guild: data.getGuildInfo(req.params.guild) });
	});

	return app;
}
