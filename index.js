const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const fs = require("fs")
const { Player } = require("discord-player")
const { Routes } = require("discord.js")




dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const UNLOAD_SLASH = process.argv[2] == "unload"

const CLIENT_ID = "1029308962643914782"

GUILD_ID = "982712020040314930"

const unloadGuild = process.argv[3]

if (unloadGuild){
    GUILD_ID = process.argv[3]
}


const client = new Discord.Client({
    intents: [
        "Guilds",  
        "GuildVoiceStates",
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 30
    }
})


let commands = []

const slashFiles = fs.readdirSync("./slash").filter((file) => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH || UNLOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    if (LOAD_SLASH){   
        rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
        })
    }
    else if (UNLOAD_SLASH){
        rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            console.log("finished unloading")
            return Promise.all(promises);
        });
    }

}

else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
        client.user.setActivity(`monkeys at school`, {type: Discord.ActivityType.Watching})
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}
