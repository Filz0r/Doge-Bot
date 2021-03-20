const DogeBotClient = require('./controller/client');
const config = require('./config.json');

const client = new DogeBotClient(config);
client.start();
const ownerID = config.owners[0]
module.exports.ownerID = { ownerID };