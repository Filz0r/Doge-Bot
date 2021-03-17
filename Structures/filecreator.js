const save = require('./saveDB');
const read = require('./getDB');
const ga = require('./giveaway');
let i = 0;
// saves the mon list
module.exports.setList = async (id, args, message) => {
	const argnum = args.length;
	if(argnum === 1 || args[1] === 'change' && argnum === 2) {
		// the following mess is me deconstructing my data object
		const data = Object.entries(await read.getList(id));
		const quants = data[2];
		const quant = quants[1];
		const listLen = quant.length;
		const mons = data[1];
		const monI = mons[1];
		const status = data[3];
		const sta = status[1];
		const index = monI.indexOf(`${args[0]}`);
		// rebuilds my objects before sending them to the db
		const listBuiler = function(list) {
			// eslint-disable-next-line no-unused-vars
			list = data;
			const test = [];
			let holder = {};
			i = 0;
			do {
				holder = {
					mon:monI[i],
					quant:parseInt(quant[i]),
					status:sta[i],
				};
				i++;
				test.push(holder);
			} while (i < listLen);
			return test;
		};
		// verifies if the quant and status before deducting and breaks if both are true
		if(quant[index] === 0 && sta[index] === false) {
			message.reply('you don\'t have anymore of that already!');
			return;
		}
		// to change the status to false for when the list only has one mon
		if(quant[index] <= 1 && listLen === 1) {
			sta[index] = false;
			quant[index] -= 1;
			const test = listBuiler(data);
			await save.saveListToDB(id, test);
			message.reply('you don\'t have anymore of that already!');
			return test;
		}
		// to change the status to false when the list has more than one mon
		else if(quant[index] <= 1 && listLen > 1) {
			sta[index] = false;
			quant[index] -= 1;
			const test = listBuiler(data);
			await save.saveListToDB(id, test);
			return test;
		}
		// deducts the mon selected
		else {
			quant[index] -= 1;
			const test = listBuiler(data);
			await save.saveListToDB(id, test);
			return test;
		}
	}
	else {
		const data = [];
		let mons = {};
		i = 0;
		do {
			mons = {
				mon:args[i],
				quant:parseInt(args[i + 1]),
				status: true,
			};
			i = i + 2;
			data.push(mons);
		} while (i < argnum);
		console.log(data);
		await save.saveListToDB(id, data);
		return data;
	}
};
// stores the hosts info
module.exports.setInfo = async (id, args, message) => {
	if (args[2] === 'RAND' && args[3] === 'LOCK') {
		const codes = await ga.randCodeFixed(id);
		const data = {
			ign: args[1],
			code1: codes.code1,
			code2: codes.code2,
			dd: args[4],
			ping: args[5],
		};
		await save.saveInfoToDb(id, data);
		message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
		return data;
	}
	else {
		const data = {
			ign: args[1],
			code1: args[2],
			code2: args[3],
			dd: args[4],
			ping: args[5],
		};
		await save.saveInfoToDb(id, data);
		return data;
	}
};
// stores a personalized description
module.exports.setDesc = async (id, text) => {
	const data = await text;
	await save.saveDescToDb(id, data);
};

