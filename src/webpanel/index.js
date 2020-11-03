const express = require("express");
const app = express();

module.exports = {
	Handler: class Handler {
		constructor() {
			console.log("hi");
		}
	}
}
