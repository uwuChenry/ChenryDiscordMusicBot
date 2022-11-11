const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

function  songDurationMS(duration) { 
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


module.exports = {
    data: new SlashCommandBuilder()
        .setName("playy")
        .setDescription("no earrape or i rape ur mom :flushed:")
        .addStringOption((option) => option.setName("thing").setDescription("thing").setRequired(true)),

    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("u need to be in vc bro")

        const queue = await client.player.createQueue(interaction.guild, {
            leaveOnEnd: false
        })
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        var timeRemaining = 0;
        if (queue.playing){
            const progress = queue.getPlayerTimestamp()

            var totalTimeInMs = 0;
            for (let i = 0; i < queue.tracks.length; i++){
                totalTimeInMs += songDurationMS(queue.tracks[i].duration);
            }
            totalTimeInMs -= songDurationMS(progress.current);
            timeRemaining = msToTime(totalTimeInMs);    
        }

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
                .setDescription(`**Added ${result.tracks.length}** songs from **[${result.playlist.title}](${result.playlist.url})** to the queue`)
                .setColor("#d6c2ce")
        }
        else {
            embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` + (queue.playing? ` | ${timeRemaining} until playback` : "None")})
            .setColor("#d6c2ce")
        }

        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
        
    },
}


