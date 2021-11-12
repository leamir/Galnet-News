require('dotenv').config();
var request = require('request');
const schedule = require('node-schedule');
const util = require('util');
const { Util } = require('discord.js');

require("./registerCommands.js")();
const checkNews = require("./newsChecker.js");

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        const time = interaction.createdTimestamp - Date.now();

        request.get({
            url: 'https://community.elitedangerous.com',
            time: true
        }, async function (err, response) {
            await interaction.reply(`Pong!\nDiscord API ping: ${time}ms.\nElite Dangerous Galnews ping: ${response.elapsedTime}ms.`);
        });
    }
    if (interaction.commandName === "eval") {

        if (interaction.user.id != "603063797871280139") {
            await interaction.reply("sure, 'dev'....");
            return;
        }

        let evaluated = "NULL";
        try {
            v = eval(interaction.options.get("code").value)
            evaluated = util.inspect(v);
        } catch (e) {
            evaluated = util.inspect(e);
        }

        interaction.reply("```" + evaluated.substring(0, 1994) + "```");
    }
});

function sendNews(news) {
    const galnewsChannel = client.channels.cache.get(process.env.CHANNEL);
    const gallogsChannel = client.channels.cache.get(process.env.LOGS_CHANNEL);

    gallogsChannel.messages.fetch({ limit: 1 }).then(messages => {
        let lastMessage = messages.first();
        if (lastMessage == undefined) { lastMessage = '' }
        else { lastMessage = lastMessage.content; }
        
        let parts = lastMessage.split("\n");
        if(parts[0].trim() == news["title"].trim() && parts[1].trim() == news["date"].trim())
            return;

        //Dont ask what this is
        news["title"] = news["title"]
            .replace(new RegExp(/\*/g, 'g'), '\\*')
            .replace(new RegExp("~", 'g'), '\\~')
            .replace(new RegExp("`", 'g'), '\\`')
            .replace(new RegExp(/\|/g, 'g'), '\\|');
        news["date"] = news["date"]
            .replace(new RegExp(/\*/g, 'g'), '\\*')
            .replace(new RegExp("~", 'g'), '\\~')
            .replace(new RegExp("`", 'g'), '\\`')
            .replace(new RegExp(/\|/g, 'g'), '\\|');
        news["body"] = news["body"]
            .replace(new RegExp(/\*/g, 'g'), '\\*')
            .replace(new RegExp("~", 'g'), '\\~')
            .replace(new RegExp("`", 'g'), '\\`')
            .replace(new RegExp(/\|/g, 'g'), '\\|');

        gallogsChannel.send(
                {
                    content:`${news["title"]}\n${news["date"]}`
                }
            );
        const mes = Util.splitMessage(`**${news["title"]}**\n${news["date"]}\n\n${news["body"]}\n\n<@&${process.env.PING_ROLE_ID}>`)
        mes.forEach(element => {
            galnewsChannel.send(
                {
                    content: element,
                    split: true
                }
            );
        });
    })
}

schedule.scheduleJob('0 0 * * * *', () => {
    checkNews(0, sendNews);
});

client.login(process.env.BOT_TOKEN);