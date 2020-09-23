# Doge-Bot
 
-This code is for an Discord bot, it requires for the user to have and mongoDB database already set up, as well as a discord bot token.
-Permanent invite link for this bot: https://discord.com/oauth2/authorize?client_id=742884972565626902&scope=bot

# Version 1.3.0 changelog:
    -Separating the users database into various other databases so that I would not need to have queries so complex as there are on the previous version.
    -Added the ability to have per server prefixes.
    -Added a reason argument to the automoderator function, this gives out a reason to the user for why he got flagged.
    -Created an tellMod function that tells active mods when a user gets flagged, if there are no active mods it tells the server owner what the user did.
    -Added Discord permissions for admin commands, meaning only users that have certain permissions that are written on the files they are needed to use those commands.
    -Created an guild collection on the database that stores all the settings each guild the bot is in.
    -Deleted a few files and condensed all of the command functions in individual files that execute them when requested.


# DogeBot v1.2.5 changelog:
    - Finalized the shiny raid commands mentioned before, and added an guide subcommand to all the host commands to explain users how to build their layouts.
    - Cleaned up my code redundancy that would not return if the args were not as expected in the giveaway commands, the raid command already has this built in.
    - Created an new scheema to store all the den info available right now, dens can be edited if needed.
    - Implemented an constant mongoDB connection wich in return makes the bot a lot more fast.
    - Cleaned up the user checking process with the update mentioned above.
    - Created an autoModerator Function that checks for user flags and flags and blocks users when they use commands they are not allowed to, this cleaned a lot of the code of the locked commands, and makes it easier to implement them.
    - Fixed following issues:
        -Bot not recognizing a mention as a prexif.
        -Bot not saying is prefix if he only is mentioned.
        -Whenever the bot is asked to run an command that does not exist it will reply that instead of ignoring the user.
        

# DogeBot v1.2.4 changelog: 
    - Fixed an issue in the help command where it did not post when the user was not added to the db.
    - Added an Image command category that sends random pictures to the users DM.
    - Completly reviewed all the code to check for typos on the outputs.
    - Started to work on shiny raid commands to implement on v1.3
