const { SlashCommandBuilder } = require("@discordjs/builders")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipp")
        .setDescription("skip"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("there are no songs bro")

        
        song = queue.nowPlaying()

        queue.skip()
        await interaction.editReply(`skipped **${song.title}**`)
    }
}