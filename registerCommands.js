const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

function run() {

    /*
    const commands = [
        {
            name: 'ping',
            description: 'Get response times.'
        },
        {
            name: 'eval',
            description: 'for dev use',
            option: [
                {
                    name: 'code',
                    type: 'STRING'
                }
            ]
        }
    ];
    */
    const commands = [
        new SlashCommandBuilder()
            .setName('eval')
            .setDescription('For dev use')
            .addStringOption(option =>
                option.setName('code')
                    .setDescription('Code to evaluate')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('pong')
    ]

    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, '905217907842224148'), //CLIENT_ID, GUILD_ID
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.log(error);
        }
    })();
}

module.exports = run;