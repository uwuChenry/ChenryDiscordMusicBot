const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("now")
        .setDescription("now Playing oaoaoaoaooaoaooa"),

    run: async ({ client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("no queue")
        }

        const currentSong = queue.nowPlaying()
        const progress = queue.getPlayerTimestamp()
        const loopMode = queue.repeatMode
        const msg = loopMode === QueueRepeatMode.QUEUE ? "playlist" : loopMode === QueueRepeatMode.TRACK? "single" : "off"


        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Now Playing: ${currentSong.title}** \n\n ${progress.current} / ${progress.end}`)
                    .setColor("#d6c2ce")
                    .setFooter({text: `Loop: ${msg}`})
            ]
        })
    }
}