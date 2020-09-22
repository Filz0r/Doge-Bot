const DogeBotClient = require('./Structures/DogeBotClient');
const config = require('./config.json');

const client = new DogeBotClient(config);
client.start();
