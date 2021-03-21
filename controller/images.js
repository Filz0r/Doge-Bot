const { MessageEmbed } = require('discord.js');
const {getRandomNum}  = require('./util')
const fetch = require('node-fetch');

const categories = {
    dog: ['puppy', 'dog', 'puppies'],
    cat: ['cat', 'cats', 'catpics', 'kitty', 'kitten'],
    bird: ['birdpics', 'birbs'],
    meme: ['memes', 'funny', 'meirl','me_irl'],
    dank: ['bonehurtingjuice', 'surrealmemes', 'dankmemes'],
    doge: ['doge', 'shiba', 'dogememe']
}

async function sendEmbed(category) {
    if (typeof category === 'string') {
        const selectedCategory = categories[category][Math.floor(Math.random() * categories[category].length)]
    const data = await fetch(`https://imgur.com/r/${selectedCategory}/hot.json`)
        .then(response => response.json())
        .then(body => body.data);
    const selected = data[Math.floor(Math.random() * data.length)];
    console.log(selected)
    const img = `https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`;
    return img;
    } else if (typeof category === 'object') {
        return category;
    }    
}

async function categorySelector(arg) {
    const categoryCheck = arg in categories
    let response;
    if (arg === 'random') {
        return await randomSelector()
    } else if (categoryCheck) {
        response = arg;
        console.log(response)
        return response
    } else if (!categoryCheck) {
        response = ['idiot', arg];
        return response;
    }
}

async function randomSelector() {
    const categoryCount = Object.keys(categories).length - 1
    const cat = Object.keys(categories)
    const randNum = await getRandomNum(0, categoryCount)
    return cat[randNum]
}



module.exports.sendImage = async (message, arg, authorID) => {
    console.log(arg)
    const category = await categorySelector(arg)
    // this function 
    const imgToSend = await sendEmbed(category)
    if (typeof imgToSend === 'string') {
        // this sends the images to dm and notifies the user
        message.client.users.cache.get(authorID).send(new MessageEmbed().setImage(imgToSend));
        return message.reply('A picture has been sent to your dm!');
    } else if (typeof imgToSend === 'object') {
        console.log(`the idiot: ${authorID} tried to request the following image category: ${imgToSend[1]}`)
        message.reply(`it seems like the category you sent \`${imgToSend[1]}\` does not exist in my programing!
These are the categories I can use: \`${Object.keys(categories)}\``)
    }
}