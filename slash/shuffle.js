const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("shuffle the playlist u dumbass"),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("u need to be in vc bro")

        const queue = await client.player.getQueue(interaction.guild)
        
        if (!queue) return interaction.editReply("theres no music bro wdym")

        await queue.shuffle()

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Queue Shuffled`)
                    .setColor("#d6c2ce")
            ]
        })
        
    },
}


