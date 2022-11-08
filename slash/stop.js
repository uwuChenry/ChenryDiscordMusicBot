const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("stop"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("there are no songs bro")

        queue.destroy()
        //await interaction.editReply("cya man")
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`cya man`)
                    .setColor("#d6c2ce")
            ]
        })
    }
}