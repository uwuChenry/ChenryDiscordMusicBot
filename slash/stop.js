const { SlashCommandBuilder } = require("@discordjs/builders")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("stop"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("there are no songs bro")

        queue.destroy()
        await interaction.editReply("cya man")
    }
}