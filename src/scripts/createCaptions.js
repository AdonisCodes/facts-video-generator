import ffmpeg from "fluent-ffmpeg"
import { config } from "../config.js"

export async function createCaptions(fact, audioDur, videoLoc, videoFinal) {
    const caption = fact.split(" ")
    const textFreq = Math.ceil(caption.length / audioDur)
    let wordcount = 0
    let filters = []
    
    for (let i = 0; i < Math.ceil(audioDur); i++) {
        const captionFragment = caption.slice(wordcount, wordcount + textFreq)
        wordcount += textFreq

        captionFragment.push("😃")

        console.log(captionFragment.join(" "))
        // console.log(currentTime + i + 1)
        filters.push(`drawtext=fontfile=./Lucida Grande Bold.ttf:text=${captionFragment.join(" ")}:fontsize=100:fontcolor=black:x='(main_w/2-text_w/2)':y=1000:borderw=2:bordercolor=black:shadowcolor=black:shadowx=2:shadowy=2:enable='between(t,${i},${i+1})'`)
      
    }

    console.log(filters)

    const cappedVideo = await new Promise((resolve, reject) => {
        ffmpeg(config.tempLocation + "final0.mp4")
        .videoFilters(
            filters
        )
        .outputOptions('-c:a copy')
        .output(config.tempLocation + 'final-1.mp4')
        .on('end', function() {
            console.log("Finnished Processing the video")
            return resolve()
        })
        .on('error', function(err, stdout, stderr) {
            console.log('An error occurred: ' + err.message);
            console.log('ffmpeg stdout: ' + stdout);
            console.log('ffmpeg stderr: ' + stderr);
        })
        .run();

    })
}

// createCaptions("this is teh thing we have been all waiting for", 20, "", "")

