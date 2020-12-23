module.exports = {
	name: "eval",
    description: "⚠ **Bot Developer Only** ⚠",
    cooldown: 0,
    execute(client, msg, args) {
        if (msg.author.id != "684048077736509503") {
			return msg.channel.send("You're not the bot dev.");
		}
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
            
			msg.channel.send("Evaluated!\n\n"+`\`\`\`\n${clean(evaled)}\n\`\`\``).catch((e) => {
				msg.channel.send("response too long");
			});
          } catch (err) {
            return msg.channel.send("Error!\n\n"+`\`\`\`\n${clean(err)}\n\`\`\``)
          }
    }
}

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
