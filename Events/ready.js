const Event = require('../Structures/Event');
const mongo = require('./../Structures/mongo');


module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
		});
	}

	async run() {
		console.log([
			'Doge bot is online!',
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`,
		].join('\n'));
		await mongo();
	}

};
