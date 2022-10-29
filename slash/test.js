const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ooaa")
        .setDescription("monkey"),
    run: async ({client, interaction}) => {

        
        await interaction.editReply("lmao imagine typing this ")
    }
}