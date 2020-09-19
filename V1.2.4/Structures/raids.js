const save = require('./saveDB');
// stores the raid host info to the database
module.exports.setRaidInfo = async (id, args) => {
	const data = {
		ign: args[0],
		name : args[4],
		fc: `${args[1]}-${args[2]}-${args[3]}`,
	};
	console.log(data);
	const ble = await save.saveRaidInfo(id, data);
	console.log(ble);
	return data;
};

module.exports.setRaidDesc = async (args) => {
    const denNum = args[0];
    const hostMode = args[1];
	const link = `https://www.serebii.net/swordshield/maxraidbattles/den${ denNum }.shtml`;
	console.log(link, hostMode);
};
