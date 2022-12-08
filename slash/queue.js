const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player')
const width = require('string-width')


function songDurationMS(duration) { 
    const times = (n, t) => { 
        let tn = 1; 
        for (let i = 0; i < t; i++) tn *= n; 
        return t <= 0 ? 1000 : tn * 1000; 
    }; 

    return duration 
        .split(":") 
        .reverse() 
        .map((m, i) => parseInt(m) * times(60, i)) 
        .reduce((a, c) => a + c, 0); 
}

function msToTime(duration) {
    var
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }
/*
function trimToWidth(str, length) {
    let out = str;
    let msgWidth = width(str);
    if (msgWidth > length) {
        out = out.slice(0, (-msgWidth + length)) + "...";
    }
    return out;
}*/

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
            let message = song.title;
            let msgWidth = width(message);
            if (msgWidth > 52){
                message = message.slice(0, -msgWidth + 52) + "..."
            }
            //let message = trimToWidth(song.title);
            return `\n\`${page * 10 + i + 1}.\` [${song.duration}] ${message} - <@${song.requestedBy.id}>`
        })

        const currentSong = queue.nowPlaying()

        const loopMode = queue.repeatMode
        const msg = loopMode === QueueRepeatMode.QUEUE ? "playlist" : loopMode === QueueRepeatMode.TRACK? "single" : "off"


        const progress = queue.getPlayerTimestamp()

        var totalTimeInMs = 0;
        for (let i = 0; i < queue.tracks.length; i++){
            totalTimeInMs += songDurationMS(queue.tracks[i].duration);
        }
        totalTimeInMs -= songDurationMS(progress.current);
        const timeRemaining = msToTime(totalTimeInMs);
        

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                    (currentSong? `**Currently Playing** \n \`[${progress.current} / ${progress.end}]\` **[${currentSong.title}](${currentSong.url})** \n Requested by: <@${currentSong.requestedBy.id}>` : "None" ) + 
                    `\n\n**Queue**${queueString}` 
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages} | ${queue.tracks.length} songs, ${timeRemaining} remaining | Loop: ${msg}`
                    })
                    .setColor("#d6c2ce")
            ]
        })
    }
}