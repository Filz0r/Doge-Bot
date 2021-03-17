const Command = require('../../Structures/Command.js');
// const mongo = require('../../Structures/mongo');
// const denSchema = require('../../schemas/denSchema');
const denlist = require('../../denlist.json');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'test',
			description: 'test',
			category: 'Owner',
			args: true,
		});
	}
	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const len = denlist[0]['sword'].length;
		const data = [];
		let i = 0;
		do {
			const test = denlist[i]['sword'][i].stars;
			data.push(test);
			i++;
		}
		while(i < len);
		console.log(data);
	}
};