const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { EventEmitter } = require("events");

module.exports = {
	Panel: class Panel extends EventEmitter {
		constructor(bot) {
			super();
			this.bot = bot;
			this.app = express();
			this.router = require("./routers/main")(bot.Client);
			this.apiRouter = require("./routers/api")(bot.Client);
			this.app.engine("hbs", exphbs({
				defaultLayout: "main",
				extname: ".html",

				helpers: {
					toString: data => JSON.stringify(data)
				}
			}));
			this.app.set("view engine", "hbs");
			this.app.set("views", path.join(__dirname, "/views"));
			this.app.use(session({
				secret: process.env.SESSION_SECRET,
				resave: false,
				saveUninitialized: true,
				cookie: { secure: "auto" }
			}));
			this.app.use("/assets", express.static(path.join(__dirname, "/assets")));

			this.app.use("/", this.router);
			this.app.use("/api", this.apiRouter);

			this.bot.start();
			this.app.listen(80, console.log("Webservice online"));
		}
	}
}
