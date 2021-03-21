# Dogebot 
Dogebot was my first programming project where I set out to learn more about how the internet works by learning, how to talk with API's in this case Discord API, and how to host own my projects at home or in the Cloud, this was the start of my true investment into programming and will also serve the purpose of allowing me to watch as my programming skills increase in each version of the bot that I publish.

While I started out by using a lot of YouTube tutorials to build versions prior to 1.2.4, after that I decided to learn how to improve that on my own with my own implementations on top of the structure I already had built with the help of the two main sources from where I got most of the structure of this bot, the links to the playlists I used are provided bellow, all of the credits for the base of my command handler and some commands go to the creators of these tutorials.

 [MenuDocs DiscordJS Youtube playlist](https://www.youtube.com/playlist?list=PLWnw41ah3I4aduzCTL98zw8PbDO6rGsWm)

 [WornOffKeys DiscordJS Youtube Playlist](https://www.youtube.com/playlist?list=PLaxxQQak6D_fxb9_-YsmRwxfw5PH9xALe)

### About/Main features
This is the code for my Discord bot, Dogebot, a bot that not only delivers memes straight to your DMs but also has a couple of unique features that allow Pokemon Gen 8 giveaways and raid hosts to easily host them. It all started with me trying to focus more on learning how to program, I wanted to build a tool to help people hosting shiny Pokemon giveaways and raids on Discord, by not generating an gigantic message that is not readable in most mobile phones. The information the bot stores for each user can be used in any server, meaning you only need to save your information once and you can host Pokemon giveaways/raids on multiple servers.

Besides this it also has a neat feature built with the aim of dealing with people that try to break, tamper and abuse the bot, just the bot not the server itself. This allows server admins/moderators to block the user that is trying to do such things, there are 2 ways for the bot to report to a server admin, the first implementation was to grab the list of admins/mods that were on the server and check if any of them are online, when there are admins/mods online, the bot picks a random one and reports to them with a ping, if there are no admins/mods online the bot will ping the server owner, even if he's offline.

The second and more nice way for the bot to report issues to server admins is to set a channel for the output of these reports, this can also be the output for other bots, as long as the bot has permission to send a message to that channel nothing should go wrong.(**Due to a rework of auto-mod this is the recommended setting, but it's not enabled by default!**)

The offender will always be notified via DM no matter what, if he has them closed we will just not know about it, until eventually the bot blocks him after 10 offences, this will forbid the user from using any commands, and will start to increase an other trigger called **ignore flags** once the user reaches 10 flags he will start to be ignored by the bot.

An user can be unblocked at any time, and if unblocked all of his normal flags will be reset to 0, but his ignore flags will always remain, the user can also be manually blocked by an server admin from using the bot with the same command however, once an user triggers a ignore flag 10 times, and makes `ignore=true` only I can make the bot start to reply to that user again, and that will only be decided after reading the logs the bot saves every time these events are triggered.

Starting from v1.4.0 I started to handle API errors that were caused when the user has DMs disabled, or when the bot does not have permission to write on a channel, because of that I had to tie the auto moderation feature with my error handling and this makes it absolutely necessary to have a log channel set if you want the bot to join your server, without this auto-mod will not always work properly if any of these errors happen, large servers might only want the bot to be able to read/write messages in some channels because of this I had to think about what would happen if an user triggered auto-mod in a channel the bot can't read/write to and this is the solution I came up with for this possible issue.
    
### Running your own instance of this bot
This was my first big project that started as a way for me to learn new things and improve my JavaScript skills, because of that versions prior to `v1.2.4` don't exist, because I did not know how to use GitHub before, I'm currently currently restructuring how the bot works to a more user friendly way that is trying to reduce the latency of the bot and at the same time trying to update this repository for easier understanding of how the bot works, for anyone that wants to add it to their server.

If you want to run your own instance of this bot I recommend that you start by using any version starting from v1.4.0, versions prior to that are not recommended as they have a lot of bugs, the stable branch is where the recommended one always saved, while the development one is well, used for development and can be completely broken, so please stay away from that branch.

It's also recommended that you read the `changelog.md` file also stored in this repository to find out what versions are better suited for you.

As the code is completely open source you can run your very own instance of the bot it only requires you to have and MongoDB database already set up, as well as a Discord bot token, you will need the sample `config.json and db.json` from the **assets** branch inside this repository, just upload the `db.json` file to your MongoDB database and fill in the config.json with your information and run it in an `NodeJS version 12 LTS` environment I use [pm2](https://pm2.keymetrics.io/) to make sure it stays online, and since pm2 has his own logger I my console.logs and error logs are all saved, proper logging will be implemented at some time, it's recommended that you use pm2 until this feature is implemented if you want to have logs with the bot deployed.

### More info
-    If you want to help me test new versions of this bot please join my Discord server where I test them.
-   If you want to learn more about what changed in each documented version of the bot please read the `changelog.md` file.
-   If you want to help developing this projects there is a to-do list bellow this section, clone the most recent stable version try to implement the feature/bug fix listed in there!


## TODOS
Items in this list with version numbers after them are intended to be implemented when ever I finish implementing and completely refactoring v1.3.0 in to a more easy to upgrade structure that allows me to push bug fixes and new features in the future. The list basically works as a road map for future planned/requested features.

#### V1.4.X
-   Rework help menu to give more information and giveaway and raid guides.
-   Finish populating the Raid Den database with the dens from the 2nd DLC.
-   Implement a bug report command, that will send a message with the report to the server where I test and develop this bot.
-   Implement a support command in case anyone wants to suport this project for whatever reason.
-   Implement proper logging.
-   Implement a Spam channel feature similar to the logs one, for users to store information about their giveaways/raids without cluttering the general text channels.
-   Implement a way for the bot to update the promoted dens whenever they change, by itself, removing human errors from the equation.
-   ~~Figure out a way to make the bot delete/change the raid message announcments he writes after the host is finished with hosting.~~(Implemented in **v1.4.0** but could raise issues if the message gets deleted, maybe providing any of the options is a fix for this but I'll need more data before deciding what to do)

#### Future releases
-   Implement some form of caching to try to reduce latency. **(v1.5 and above?)**
-   Refractor the Raid and Giveaway related functions. **(v1.5 and above)**
-   Implement some kind of web-based front end to also store pokemon giveaway/raid information. **(v1.6 and above)**
-   Implement more message layouts. **(v1.6 and above)**
-   Create a container image to make it easier for other users to deploy private instances of this bot, and to also help me pushing new releases faster. **(v1.6 and above)**

