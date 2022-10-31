const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playnextt")
        .setDescription("playnext")
        .addStringOption((option) => option.setName("thing").setDescription("thing").setRequired(true)),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("u need to be in vc bro")

        const queue = await client.player.getQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        const query = interaction.options.getString("thing")
        const result = await client.player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(()=> {
                console.log("oadslfdkfjsldkfjlsj")
            });
        
        if (!result || !result.tracks.length) return interaction.editReply("nothing found")

        if (result.playlist) return interaction.editReply("bro u cant play next an entire fucking playlist")
        if (!result.playlist) queue.insert(result.tracks[0])

        song = result.playlist ? result.playlist : result.tracks[0]
        
        embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the top of the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
        

        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
        
    },
}


