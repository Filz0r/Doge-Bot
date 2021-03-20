# Version 1.4.0 changelog:
- Reorganized the GitHub repository for better tracking of improvements and bugs.
- Complete rework of the code base with the aim of fixing several bugs such as:
- Mentioning the bot to find out the prefix not working.
- Auto-moderation implementation would sometimes go crazy by itself.
- Fixed an issue where the bot would break if an user tried to use the bot after a change of tag.
- Fixed an issue where the API would give an error if the bot does not have permission to write in the channel a user issues a command. Refer to the added features section for more information on this.

### Added features/ commands:

- Added an host command for users to activate the host functionalities.
- Added a status command (owner only) to change the bot status on the go.
- Added the ability for the block command to either block or unblock an user (server admin only).
- Added an ignore command, to completely block of users that get blocked in one server and then ask for someone to unblock them on other server.
- Created a default status for when the bot goes online.
- Added the logs command, to set a channel as a auto moderator log output instead of the channel where the offence happened.
- Due to the fact that the Discord API sends an error when there's a permission issue relating a message that can't be sent or similar, the API throws an Unhandled promise rejection, so according to the DiscordJS documentation I need to execute that function in order to debug it and try to implement a fix, so I added that piece of code provided [here](https://discordjs.guide/popular-topics/errors.html#how-to-diagnose-api-errors) and used it as a way into implementing a bug submit command, as well as a error handler, that I talk about in the todo list in the `README.md` file.
- Implemented the raid end sub command that edits all the posts you have of active raids and informs users that your raid as ended, across all servers.

### Extra info:

- The structures are now called controllers, because they control a how the bot works.
- Cleaned up how the user/guild related controllers work, and created a new one for all auto moderation features.
- From now on the user and guild controllers will only change the user and guild database.
- Starting from version 1.3.0 the use of promises inside the functions/controllers have been implemented, in this version they were either reworked or moved to different files.
        
### Removed/changed the following commands/features:

- Removed lock that required server admins to manually add users as Pokemon hosts.
- Removed the help menu being sent to a DM, however since the bot sends an help dynamic help menu that varies according to user permissions, it's not recommended that server admins issue this command in general chats because admin only commands will show up, this was to help with admins of large servers that have to disable DMs, and to also users that have DMs disabled.
- **Add** command used by admins to add a user as a Pokemon host.
- **Den** command used to update raid dens has been removed, in the future the bot will update them by itself.
- Adjusted the autoModeration function to work with the error handling, the bot first tries to send a DM to the user warning him,then tries to reply to the channel if the user has DMs disabled, finally if the bot can't write to that channel it will report to the log channel.

## Version 1.3.0 changelog:
- Separating the users database into various other databases so that I would not need to have queries so complex as there are on the previous version.
- Added the ability to have per server prefixes.
- Added a reason argument to the automoderator function, this gives out a reason to the user for why he got flagged.
- Added/improved guide sub commands to explain users how to build their layouts.
- Cleaned up my code redundancy that would not return if the args were not as expected in the giveaway commands, the raid command already has this built in.
- Created an new scheema to store all the den info available right now, dens can be edited if needed.
- Implemented an constant mongoDB connection wich in return makes the bot a lot more fast.
- Cleaned up the user checking process with the update mentioned above.
- Created an autoModerator Function that checks for user flags and flags and blocks users when they use commands they are not allowed to, this cleaned a lot of the code of the locked commands, and makes it easier to implement them.
- Fixed following issues:
        - Bot not recognizing a mention as a prexif.
        - Bot not saying is prefix if he only is mentioned.
        - Whenever the bot is asked to run an command that does not exist it will that instead of ignoring the user.

## DogeBot v1.2.5 changelog:
- Finalized the shiny raid commands mentioned before, and added an guide subcommand to all the host commands to explain users how to build their layouts.
- Cleaned up my code redundancy that would not return if the args were not as expected in the giveaway commands, the raid command already has this built in.
- Created an new scheema to store all the den info available right now, dens can be edited if needed.
- Implemented an constant mongoDB connection wich in return makes the bot a lot more fast.
- Cleaned up the user checking process with the update mentioned above.
- Created an autoModerator Function that checks for user flags and flags and blocks users when they use commands they are not allowed to, this cleaned a lot of the code of the locked commands, and makes it easier to implement them.
- Fixed following issues:
        - Bot not recognizing a mention as a prexif.
        - Bot not saying is prefix if he only is mentioned.
        - Whenever the bot is asked to run an command that does not exist it will reply that instead of ignoring the user.
        

## DogeBot v1.2.4 changelog: 
- Fixed an issue in the help command where it did not post when the user was not added to the db.
- Added an Image command category that sends random pictures to the users DM.
- Completly reviewed all the code to check for typos on the outputs.
- Started to work on shiny raid commands to implement on v1.3
