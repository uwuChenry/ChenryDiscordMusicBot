const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueueRepeatMode } = require('discord-player')
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("looooooooooooop")
        .addIntegerOption((option) => option.setName("asdf").setDescription("playlist, single, off")
            .addChoices(
                {name: 'playlist', value: QueueRepeatMode.QUEUE}, 
                {name: 'single', value: QueueRepeatMode.TRACK}, 
                {name: 'off', value: QueueRepeatMode.OFF}
            )
            .setRequired(true)
        ),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("there are no songs bro")

        let loopMode = interaction.options.getInteger("asdf")
        queue.setRepeatMode(loopMode)
        const msg = loopMode === QueueRepeatMode.QUEUE ? "playlist" : loopMode === QueueRepeatMode.TRACK? "single" : "off"
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`loop mode has been set to **${msg}**`)
                    .setColor("#d6c2ce")
            ]
        })
    }
}