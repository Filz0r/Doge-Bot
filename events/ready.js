const Event = require('../controller/events.js');
const mongo = require('../controller/db.js');


module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
		});
	}

	async run() {
		console.log([
			'Dogebot is online!',
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`,
		].join('\n'));
		await mongo();
		this.client.user.setPresence({
			activity: {name: 'You can check my prefix by pinging me!'},
			status : 'online'
		});
	}

};