module.exports = bot => { return {
		getGuildsMemberIsAdmin: userid => bot.guilds.cache.filter(async g => (await g.members.fetch(userid)) && (await g.members.fetch(userid)).hasPermission("MANAGE_GUILD", { checkAdmin: true, checkOwner: true })).map(g => { return { name: g.name, id: g.id, icon: g.iconURL({ format: "png", dynamic: true, size: 512 }) }}),
		getGuildInfo: guildid => {
			let g = bot.guilds.cache.get(guildid);
			return {
				name: g.name,
				id: g.id,
				icon: g.iconURL({ format: "png", dynamic: true }),
				channels: g.channels.cache.map(c => { return { name: c.name, id: c.id, type: c.type } })
			}
		},

		getSettings: guildid => bot.reqSettings.get(guildid) || false
	}
}
