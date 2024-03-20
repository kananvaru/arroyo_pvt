module.exports = {
  name: 'ping',
  description: 'Displays the bot\'s latency',
  execute(message, args) {
      const ping = Date.now() - message.createdTimestamp;
     message.channel.send(`Bot latency is ${ping}ms.`);
        },
    };