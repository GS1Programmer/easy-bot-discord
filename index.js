const { Client, GatewayIntentBits } = require('discord.js')
const { getAllFilesSync, getFilesSync } = require('aio-get-all-files')
const path = require('path')

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)]
})

// Now the event and command

const allEventFolder = getFilesSync(path.join(__dirname, 'events'), true);

for (const eventFolder of allEventFolder) {
    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()
    const allEventFiles = getAllFilesSync(eventFolder)

    for (const eventFile of allEventFiles) {
        client.on(eventName, async (arg) => {
            const eventFunc = require(eventFile)
            await eventFunc(client, arg)
        })
    }
}

client.once('ready', () => {
    let command = [];
    let commandData = [];
    const allCommandPath = getAllFilesSync(path.join(__dirname, 'command'))

    for (const commandPath of allCommandPath) {
        const commandObject = require(commandPath)
        command.push(commandObject)
    }

    for (const cmd of command) {
        const { data } = cmd;

        try { data = data.toJSON() } catch (error) {}

        commandData.push(data)
        console.log(`Registering command '${data.name}'`);
    }

    client.application.commands.set(commandData); 

    client.on('interactionCreate', (interaction) => {
        if(interaction.isChatInputCommand()) {
            const  commandObject = command.find(
                (cmd) => cmd.data.name === interaction.commandName
            )

            if(!commandObject) return;

            commandObject.execute(client, interaction)
        }
    })
})

/*
client.on('ready', (c) => {
    console.log(`Has login to ${c.user.tag}`);
})
*/

client.login('Bot discord token')