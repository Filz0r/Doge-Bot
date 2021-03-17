# About this branch
This branch is where all the assets needed to run your own version of the bot are stored.

## config.json
This is an example file on how to build your own config file, you need to provide the following:
- The default prefix you want the bot to use when he joins a new server.
- The bot token, this is needed for the bot to go online.
- A MongoDB URI, this can be an MongoDB provided one with the help of Mongo Atlas or, your own if you host your own database.
- Finally the bot needs to know your Discord ID, this is for owner only commands like killing the bot instance or changing the bot status.

## db.json
This file is all the information the bot uses to help users host Pokemon gen 8 shiny raids, you just need to create a collection called dens, and then import this JSON file into that collection.
Right now it only has all the raid dens that were present until the second DLC was launched, and all information was scrapped by myself using serebi. 
If you want to help populate the rest of the database please get in contact with me.
