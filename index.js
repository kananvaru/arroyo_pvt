const { Client, Intents } = require('discord.js');
const readline = require('readline');
const fs = require('fs');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ] 
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let token = '';
let channelId = '';
let roleId = '';
let prefix = ''; // Define prefix variable

rl.question('Enter your bot token: ', (answer) => {
    token = answer;
    rl.question('Enter the channel ID where the bot should listen: ', (answer) => {
        channelId = answer;
        rl.question('Enter the role ID to assign: ', (answer) => {
            roleId = answer;
            rl.question('Enter the bot command prefix: ', (answer) => {
                prefix = answer;
                startBot();
                rl.close(); // Close the readline interface once all input is received
            });
        });
    });
});

function startBot() {
    client.once('ready', () => {
        console.log(`${client.user.username} is ready.`);
    });

    client.on('messageCreate', async (message) => {
        if (message.channelId === channelId && message.attachments.size > 0) {
            const member = message.member;
            if (member) {
                try {
                    await member.roles.add(roleId);
                    console.log(`Role assigned to ${member.user.tag}.`);
                    message.reply(`Done ${member}, you are verified. check <#1168875793733132398>.`);
                } catch (error) {
                    console.error('Error assigning role:', error);
                }
            }
        } else if (message.channelId === channelId && message.content.toLowerCase().includes('add screenshot for proof')) {
            message.reply('Please add a screenshot for proof.');
        }
    });

    client.login(token);
}

// Command handling
client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});
