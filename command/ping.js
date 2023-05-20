module.exports = {
    data: {
        name: 'ping',
        description: 'Pong!'
    },
  
    execute(client, interaction) {
      interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
}