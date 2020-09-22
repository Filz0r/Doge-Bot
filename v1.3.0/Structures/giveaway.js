const GIVESCHEMA = require('../schemas/giveawaySchema');
function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
let i = 0;
// generates random codes
module.exports.randCode = async () => {
	const num1 = getRandomNum(0, 9);
	const num2 = getRandomNum(0, 9);
	const num3 = getRandomNum(0, 9);
	const num4 = getRandomNum(0, 9);
	const data = {
		code1: [num1, num2, num3, num4].join(''),
		code2: [num2, num4, num1, num3].join(''),
	};
	return data;
};
// saves the users info to the db
module.exports.setInfo = async (id, args, message) => {
	const result = await GIVESCHEMA.findOne({
		_id: id,
	});
	if(result !== null) {

		if (args[2] === 'RAND' && args[3] === 'RAND') {
			const codes = await this.randCode();
			await GIVESCHEMA.findOneAndUpdate({
				_id: id,
			},
			{
				ign: args[1],
				code1: codes.code1,
				code2: codes.code2,
				dd: args[4],
				ping: args[5],
			});
			message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
		}
		else {
			await GIVESCHEMA.findOneAndUpdate({
				_id: id,
			},
			{
				ign: args[1],
				code1: args[2],
				code2: args[3],
				dd: args[4],
				ping: args[5],
			});
		}

	}
	else if (result === null) {

		if (args[2] === 'RAND' && args[3] === 'RAND') {
			const codes = await this.randCode();
			await new GIVESCHEMA({
				_id: id,
				ign: args[1],
				code1: codes.code1,
				code2: codes.code2,
				dd: args[4],
				ping: args[5],
			}).save();
			message.client.users.cache.get(id).send('Your trade code is ' + codes.code1 + '-' + codes.code2 + '!');
		}
		else {
			await new GIVESCHEMA({
				_id: id,
				ign: args[1],
				code1: args[2],
				code2: args[3],
				dd: args[4],
				ping: args[5],
			}).save();
		}

	}
};
// saves the list of pokemon to the db
module.exports.setList = async (id, args) => {
	let data = [];
	let mons = {};
	const argnum = args.length;
	const { list } = await GIVESCHEMA.findOne({
		_id: id,
	});
	if(list !== null) {
		data = [];
		mons = {};
		i = 0;
		do {
			mons = {
				mon: args[i],
				quant: parseInt(args[i + 1]),
				status: true,
			};
			i = i + 2;
			data.push(mons);
		} while (i < argnum);
		/* console.log(data);
		console.log(mons);
		console.log(args); */
		return await GIVESCHEMA.findOneAndUpdate({ _id: id }, { list: data	});
	}
	else if (list === null) {
		data = [];
		mons = {};
		i = 0;
		do {
			mons = {
				mon: args[i],
				quant: parseInt(args[i + 1]),
				status: true,
			};
			i = i + 2;
			data.push(mons);
		} while (i < argnum);
		return await new GIVESCHEMA({ _id: id, list: data	}).save();
	}
};
// edits the list of pokemon when the user is hosting the giveaway
module.exports.editList = async (id, args, message, prefix) => {
	const result = await GIVESCHEMA.findOne({
		_id: id,
	});
	if (result === null) return message.reply(`you need to set your list before starting your giveaway! \nUse \`${prefix}giveaway guide\` for more help about this command`);
	if (result !== null) {
		// the following mess is me deconstructing my objects for easy access
		const { list } = await GIVESCHEMA.findOne({ _id: id });
		const data = Object.entries(list);
		const quants = data[2];
		const quant = quants[1];
		const listLen = quant.length;
		const mons = data[1];
		const monI = mons[1];
		const status = data[3];
		const sta = status[1];
		const index = monI.indexOf(`${args[0]}`);
		// rebuilds my objects before sending them to the db
		const listBuiler = function(objs) {
			// eslint-disable-next-line no-unused-vars
			objs = data;
			const test = [];
			let holder = {};
			i = 0;
			do {
				holder = {
					mon: monI[i],
					quant: parseInt(quant[i]),
					status: sta[i],
				};
				i++;
				test.push(holder);
			} while (i < listLen);
			return test;
		};
		// verifies if the quant and status before deducting and breaks if both are true
		if (quant[index] === 0 && sta[index] === false) {
			message.reply('you don\'t have anymore of that already!');
			return false;
		}
		// to change the status to false for when the list only has one mon
		if (quant[index] <= 1 && listLen === 1) {
			sta[index] = false;
			quant[index] -= 1;
			const test = listBuiler(list);
			await GIVESCHEMA.findOneAndUpdate({ _id: id }, { list: test	});
			message.reply('has ended his giveaway!');
			return false;
		}
		// to change the status to false when the list has more than one mon
		else if (quant[index] <= 1 && listLen > 1) {
			sta[index] = false;
			quant[index] -= 1;
			const test = listBuiler(list);
			await GIVESCHEMA.findOneAndUpdate({ _id: id }, { list: test	});
			return true;
		}
		// deducts the mon selected
		else {
			quant[index] -= 1;
			const test = listBuiler(list);
			await GIVESCHEMA.findOneAndUpdate({ _id: id }, { list: test	});
			return true;
		}
	}

};

module.exports.sendMsg = async (id, prefix, message) => {
	i = 0;
	const result = await GIVESCHEMA.findById({ _id: id });
	if (result !== null) {
		const { list, ign, code1, code2, dd, ping, desc } = await GIVESCHEMA.findOne({ _id: id });
		const monQt = list.mon.length;
		const msgHead = desc ? '```md\n< ' + desc + ' >\n' : '```md\n< I\'m doing the following giveaway! >\n' ;
		const msgInfo = '\n< IGN: ' + ign + ' >\n' + '< Code: ' + code1 + '-' + code2 + ' >\n' + '#Double Dipping (be considereate please): ' + dd + '\n' + '#Ping when we connect: ' + ping + '```';
		const msg = {};
		msg.content = [];
		const msgList = [];
		for (i = 0; i < monQt; i++) {
			const row = '[' + list.mon[i] + '](x' + list.quant[i] + ')';
			msgList.push(row);
		}
		const data = msgHead + msgList.join('\n') + msgInfo;
		msg.content.push(data);
		return msg.content;
	}
	else {
		return message.reply(`there is a problem with your list please use \`${ prefix }giveaway guide\` for help!`);
	}

};

// eslint-disable-next-line no-unused-vars
module.exports.check = async (id, mon, message) => {
	const { list } = await GIVESCHEMA.findOne({
		_id: id,
	});
	const status = Object.keys(list.status).every((k) => list.status[k] === false);
	if (status) {
		message.reply('your giveaway has already ended!');
		return false;
	}
	if (!list.mon.includes(`${ mon}`)) {
		message.reply(`that pokemon is not on your list\nAvailable pokemon: \`${list.mon.join(', ')}\`\nPokemon given: \`${ mon }\``);
		return false;
	}
	return true;
};
