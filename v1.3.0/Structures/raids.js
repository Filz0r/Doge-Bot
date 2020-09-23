const raidSchema = require('../schemas/raidSchema');
const denSchema = require('../schemas/denSchema');

module.exports.setRaidInfo = async (id, args) => {
	let result = await raidSchema.findOne({ _id: id });
	if (result !== null) {
		result = await raidSchema.findOneAndUpdate({
			_id: id,
		},
		{
			_id: id,
			ign: args[1],
			name : args[2],
			fc: `${args[3]}-${args[4]}-${args[5]}`,
		});
		return result;
	}
	else if (result === null) {
		result = await new raidSchema({
			_id: id,
			ign: args[1],
			name : args[2],
			fc: `${args[3]}-${args[4]}-${args[5]}`,
		}).save();
	}
	return result;
};

module.exports.setRaidDesc = async (id, args) => {
	let result = await raidSchema.findOne({ _id: id });
	const hostMode = args[0].toLowerCase();
	const rotation = args[2].toLowerCase();
	if(rotation !== 'rotating' && rotation !== 'fixed') return false;
	if (result !== null) {
		if (hostMode === 'auto') {
			if(args[8].length > 3) return false;
			result = await raidSchema.findOneAndUpdate({
				_id: id,
			},
			{
				mode: hostMode,
				denNum : args[1].toLowerCase(),
				rotation: args[2].toLowerCase(),
				game: args[3].toLowerCase(),
				code1: args[4],
				code2: args[5],
				timer: args[6],
				shiny: args[7].toLowerCase(),
				stars: args[8],
				fixMon: args[9] === undefined ? null : args[9],
			});
			return result;
		}
		if(hostMode === 'manual') {
			if(args[7].length > 3) return false;
			result = await raidSchema.findOneAndUpdate({
				_id: id,
			},
			{
				mode: hostMode,
				denNum : args[1].toLowerCase(),
				rotation: args[2].toLowerCase(),
				game: args[3].toLowerCase(),
				code1: args[4],
				code2: args[5],
				timer: null,
				shiny: args[6].toLowerCase(),
				stars: args[7],
				fixMon: !args[8] ? null : args[8],
			});
			return result;
		}
	}
	else if(result === null) {
		if (hostMode === 'auto') {
			if(args[8].length > 3) return false;
			result = await new raidSchema({
				mode: hostMode,
				denNum : args[1].toLowerCase(),
				rotation: args[2].toLowerCase(),
				game: args[3].toLowerCase(),
				code1: args[4],
				code2: args[5],
				timer: args[6],
				shiny: args[7].toLowerCase(),
				stars: args[8],
				fixMon: !args[9] ? null : args[9],
			}).save();
			return result;
		}
		if(hostMode === 'manual') {
			if(args[7].length > 3) return false;
			result = await raidSchema({
				mode: hostMode,
				denNum : args[1].toLowerCase(),
				rotation: args[2].toLowerCase(),
				game: args[3].toLowerCase(),
				code1: args[4],
				code2: args[5],
				timer: null,
				shiny: args[6].toLowerCase(),
				stars: args[7],
				fixMon: !args[8] ? null : args[8],
			}).save();
			return result;
		}
	}
};

module.exports.sendRaidMsg = async (id) => {
	const raid = await raidSchema.findOne({ _id: id });
	if (raid === null) return false;
	if (raid.mode === 'auto') {
		const denList = await this.getDenList(raid.game, raid.denNum, raid.stars, raid.fixMon);
		const msg = '```md' + `\n#This raid is being ${raid.mode} hosted!\n\n< Game : ${raid.game}\nSW: ${raid.fc}\nIGN/SN: ${raid.ign}/${raid.name}\nCode Will always be ${raid.code1} ${raid.code2}\n${raid.shiny} Shiny Den ${raid.denNum} - ${raid.rotation} - stars: ${raid.stars} >\n\n[Available Pokemon](${denList})\n\n#Raids will be up every 5 min or so.\n#The bot will add friend requests between battles- no need to let me know you added me then!\n#If raid freezes airplane out or wait!\n#Please be ready to go at the ${raid.timer} minute mark or the raid will fail!\n#Do not send me DM/ping me unless the bot is not posting the raids anymore(over 30min)\n\n➡️ If You are seeing this that means that the bot is still active!⬅️\n` + '\n```';
		// const link = `\nhttps://www.serebii.net/swordshield/maxraidbattles/den${raid.denNum}.shtml`;
		return msg;
	}
	else if(raid.mode === 'manual') {
		const denList = await this.getDenList(raid.game, raid.denNum, raid.stars, raid.fixMon);
		const msg = '```md' + `\n#This raid is being ${raid.mode} hosted!\n\n< Game : ${raid.game}\nSW: ${raid.fc}\nIGN/SN: ${raid.ign}/${raid.name}\nCode Will always be: ${raid.code1} ${raid.code2}\n${raid.shiny} Shiny Den ${raid.denNum} - ${raid.rotation} - stars: ${raid.stars} >\n\n[Available Pokemon](${denList})\n[Current Pokemon being hosted](${raid.fixMon})\n\n#Please ping the host when you add him to let him know\n#The host might not be okay with Double Dipping, ask before joining twice\n#Please delete the host when he or you are done joining as this makes their lifes a lot easier!` + '\n```';
		return msg;
	}
};

module.exports.getDenList = async (game, denNum, stars, fixMon) => {
	const dupRem = function	removeDuplicates(arr) {
		return [...new Set(arr)];
	};
	const list = await denSchema.findOne({ _id: denNum });
	if (fixMon === null || fixMon.length === 0) {
		const starsStart = stars.slice(0, 1);
		const starsEnd = stars.slice(-1);
		const listStart = Object.values(list[game][starsStart]);
		const listEnd = Object.values(list[game][starsEnd]);
		let merged = dupRem([ ...listStart, ...listEnd ]).join(', ');
		if (starsStart === 3 && starsEnd === 5) {
			const listMid = Object.values(list[game][4]);
			merged = dupRem([...listStart, ...listMid, ...listEnd]);
		}
		return merged;
	}
	else {
		return fixMon;
	}
};

module.exports.changeFixMon = async (id, data) => {
	const result = await raidSchema.findOneAndUpdate({ _id: id }, {	fixMon: data });
	return result;
};
