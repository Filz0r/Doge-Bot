// const fs = require('fs');
const read = require('./getDB');
const save = require('./saveDB');
let i = 0;
function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
module.exports.sendMsg = async (id) => {
	i = 0;
	const infoData = await read.getInfo(id);
	const listData = await read.getList(id);
	const descData = await read.getDesc(id);
	const monQt = listData.mon.length;
	const msgHead = descData ? '```md\n< ' + descData + ' >\n' : '```md\n< I\'m doing the following giveaway! >\n' ;
	const msgInfo = '\n< IGN: ' + infoData.ign + ' >\n' + '< Code: ' + infoData.code1 + '-' + infoData.code2 + ' >\n' + '#Double Dipping (be considereate please): ' + infoData.dd + '\n' + '#Ping when we connect: ' + infoData.ping + '```';
	const msg = {};
	msg.content = [];
	const msgList = [];
	for (i = 0; i < monQt; i++) {
		const row = '[' + listData.mon[i] + '](x' + listData.quant[i] + ')';
		msgList.push(row);
	}
	const data = msgHead + msgList.join('\n') + msgInfo;
	msg.content.push(data);
	return msg.content;
};
module.exports.randCodeFixed = async () => {
	const Num1 = getRandomNum(1000, 9999);
	const Num2 = getRandomNum(1000, 9999);
	const data = {
		code1: Num1,
		code2: Num2,
	};
	return data;
};
module.exports.randCodeChange = async (id) => {
	const { ign, dd, ping } = await read.getInfo(id);
	const Num1 = getRandomNum(1000, 9999);
	const Num2 = getRandomNum(1000, 9999);
	const data = {
		ign: ign,
		code1: Num1,
		code2: Num2,
		dd: dd,
		ping: ping,
	};
	await save.saveInfoToDb(id, data);
	return data;
};

