const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("remove thing from queue (number) pls")
        .addNumberOption((option) => option.setName("number").setDescription("song number u wana remove").setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("theres no songs bro")

        const thing = (interaction.options.getNumber("number") - 1)
        if (thing > queue.tracks.length){
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`bro its none existent`)
                    .setColor("#d6c2ce")
                    .setFooter({text: `use some brain dude`})
                ]
            })
            return
        }
        const song = queue.tracks[thing]
        queue.remove(thing)
        const length = queue.tracks.length
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`removed **${song.title}**`)
                    .setColor("#d6c2ce")
                    .setFooter({text: `There are ${length} songs in the queue`})
            ]
        })
    }
}