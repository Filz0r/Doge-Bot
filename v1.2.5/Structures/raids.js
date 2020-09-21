const save = require('./saveDB');
const read = require('./getDB');
const userSchema = require('../schemas/userSchema');
// stores the raid host info to the database
module.exports.setRaidInfo = async (id, args) => {
	const data = {
		ign: args[0],
		name : args[4],
		fc: `${args[1]}-${args[2]}-${args[3]}`,
	};
	await save.saveRaidInfo(id, data);
	return data;
};

module.exports.setRaidDesc = async (id, args) => {
	const hostMode = args[0].toLowerCase();
	let data = {};
	if (hostMode.length > 7) return;
	if (hostMode === 'auto') {
		data = {
			mode: hostMode,
			denNum : args[1].toLowerCase(),
			rotation: args[2].toLowerCase(),
			game: args[3].toLowerCase(),
			code1: args[4],
			code2: args[5],
			timer: args[6],
			shiny: args[7].toLowerCase(),
			stars: args[8],
			fixMon: args[9],
		};
		if(!args[9]) data.fixMon = null;
		if (data.stars.length < 3) return;
		await save.saveRaid(id, data);
		return;
	}
	if(hostMode === 'manual') {
		data = {
			mode: hostMode,
			denNum : args[1].toLowerCase(),
			rotation: args[2].toLowerCase(),
			game: args[3].toLowerCase(),
			code1: args[4],
			code2: args[5],
			timer: null,
			shiny: args[6].toLowerCase(),
			stars: args[7],
			fixMon: args[8],
		};
		if (data.stars.length > 3) return;
		await save.saveRaid(id, data);
		return;
	}
};

module.exports.sendRaidMsg = async (id) => {
	const raidInfo = await read.getRaidInfo(id);
	const raid = await read.getRaid(id);
	if (raid.mode === 'auto') {
		const denList = await this.getDenList(raid.game, raid.denNum, raid.stars, raid.fixMon);
		const msg = '```md' + `\n#This raid is being ${raid.mode} hosted!\n\n< Game : ${raid.game}\nSW: ${raidInfo.fc}\nIGN/SN: ${raidInfo.ign}/${raidInfo.name}\nCode Will always be ${raid.code1} ${raid.code2}\n${raid.shiny} Shiny Den ${raid.denNum} - ${raid.rotation} - stars: ${raid.stars} >\n\n[Available Pokemon](${denList})\n\n#Raids will be up every 5 min or so.\n#The bot will add friend requests between battles- no need to let me know you added me then!\n#If raid freezes airplane out or wait!\n#Please be ready to go at the ${raid.timer} minute mark or the raid will fail!\n#Do not send me DM/ping me unless the bot is not posting the raids anymore(over 30min)\n\n➡️ If You are seeing this that means that the bot is still active!⬅️\n` + '\n```';
		// const link = `\nhttps://www.serebii.net/swordshield/maxraidbattles/den${raid.denNum}.shtml`;
		return msg;
	}
	else if(raid.mode === 'manual') {
		const denList = await this.getDenList(raid.game, raid.denNum, raid.stars, raid.fixMon);
		const msg = '```md' + `\n#This raid is being ${raid.mode} hosted!\n\n< Game : ${raid.game}\nSW: ${raidInfo.fc}\nIGN/SN: ${raidInfo.ign}/${raidInfo.name}\nCode Will always be: ${raid.code1} ${raid.code2}\n${raid.shiny} Shiny Den ${raid.denNum} - ${raid.rotation} - stars: ${raid.stars} >\n\n[Available Pokemon](${denList})\n[Current Pokemon being hosted](${raid.fixMon})\n\n#Please ping the host when you add him to let him know\n#The host might not be okay with Double Dipping, ask before joining twice\n#Please delete the host when he or you are done joining as this makes their lifes a lot easier!` + '\n```';
		return msg;
	}
};
module.exports.getDenList = async (game, denNum, stars, fixMon) => {
	const dupRem = function	removeDuplicates(arr) {
		return [...new Set(arr)];
	};
	const list = await read.getRaidList(game, denNum);
	if (stars.length === 3) {
		/*
		UPDATE
		const list = list[denNum][game][stars];
		*/
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
	const result = await userSchema.findOneAndUpdate({
		id: id,
	},
	{
		'raid.fixMon': data,
	},
	{
		upsert: true,
		new: true,
	});
	return result.raid.fixMon;
};

