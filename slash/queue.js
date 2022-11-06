const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("display queue")
    .addNumberOption((option) => option.setName("page").setDescription("page number").setMinValue(1)),

    run: async ({ client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("no queue")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages)
            return await interaction.editReply(`invalid page there are only ${totalPages} pages`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `\n**${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title}** -- <@${song.requestedBy.id}>`
        })

        const currentSong = queue.nowPlaying()

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing** \n\n ` +
                    (currentSong? `\`[${currentSong.duration}]\` **${currentSong.title} --** <@${currentSong.requestedBy.id}>` : "None" ) + 
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })

            ]
        })
    }

}