const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Displays bot statistics',
    execute(message, args) {
        const embed = new MessageEmbed()
            .setTitle('Bot Statistics')
            .setColor('#0099ff')
            .setTimestamp();

        // Operating System
        const osPlatform = os.platform();
        embed.addField('Operating System', osPlatform, true);

        // Node.js Version
        const nodeVersion = process.version;
        embed.addField('Node.js Version', nodeVersion, true);

        // Bot Latency
        const latency = Date.now() - message.createdTimestamp;
        embed.addField('Bot Latency', `${latency}ms`, true);

        // RAM Usage
        const totalMemory = formatBytes(os.totalmem());
        embed.addField('Total Memory', totalMemory, true);

        const freeMemory = formatBytes(os.freemem());
        embed.addField('Free Memory', freeMemory, true);

        // CPU Usage (Not directly available in Node.js)
        // You may need to use external libraries or tools to measure CPU usage

        message.channel.send({ embeds: [embed] });
    },
};

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
