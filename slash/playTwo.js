const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playyyy")
        .setDescription("no earrape or i rape ur mom :flushed:")
        .addStringOption((option) => option.setName("thing").setDescription("thing").setRequired(true)),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("u need to be in vc bro")

        const queue = await client.player.createQueue(interaction.guild)
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

        result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0])

        song = result.playlist ? result.playlist : result.tracks[0]
        if (result.playlist){
            embed
                .setDescription(`**${result.tracks.length} songs from [${result.playlist.title}](${result.playlist.url})** has been added to the queue`)
        }
        else {
            embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
        }

        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
        
    },
}


