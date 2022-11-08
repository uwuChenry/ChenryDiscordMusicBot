const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipp")
        .setDescription("skip"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("there are no songs bro")

        
        song = queue.nowPlaying()

        queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`skipped **${song.title}**`)
                    .setColor("#d6c2ce")
            ]
        })
    }
}