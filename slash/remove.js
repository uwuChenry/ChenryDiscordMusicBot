const { SlashCommandBuilder } = require("@discordjs/builders")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("removee")
        .setDescription("remove thing from queue (number) pls")
        .addNumberOption((option) => option.setName("number").setDescription("song number u wana remove").setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("theres no songs bro")

        thing = (interaction.options.getNumber("number") - 1)
        song = queue.tracks[thing]
        queue.remove(thing)
        await interaction.editReply(`removed **${song.title}**`)
    }
}