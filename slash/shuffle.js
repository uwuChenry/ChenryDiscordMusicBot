const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shufflee")
        .setDescription("shuffle the playlist u dumbass"),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("u need to be in vc bro")

        const queue = await client.player.getQueue(interaction.guild)
        
        if (!queue || !queue.playing) return interaction.editReply("theres no music bro wdym")

        let embed = new EmbedBuilder()

        await queue.shuffle()

        interaction.editReply("queue shuffled")
        
    },
}

