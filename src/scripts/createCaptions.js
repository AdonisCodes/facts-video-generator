import ffmpeg from "fluent-ffmpeg"
import wait from "wait"
import { config } from "../config.js"

export async function createCaptions(fact, audioDur, videoLoc, videoFinal) {
    let caption = fact.split(" ")
    let textFreq = Math.ceil(caption.length / audioDur)
    let wordcount = 0
    let filters = []
    
    for (let i = 0; i < Math.ceil(audioDur); i++) {
        let captionFragment = caption.slice(wordcount, wordcount + textFreq)
        wordcount += textFreq

        captionFragment.push("😃")

        console.log(captionFragment.join(" "))
        // console.log(currentTime + i + 1)
        filters.push(`drawtext=fontfile=Lucida Grande Bold.ttf:text=${captionFragment.join(" ")}:fontsize=100:fontcolor=black:x='(main_w/2-text_w/2)':y=1000:borderw=2:bordercolor=black:shadowcolor=black:shadowx=2:shadowy=2:enable='between(t,${i},${i+1})'`)
      
    }

    console.log(filters)
    ffmpeg(config.tempLocation + "final0.mp4")
    .videoFilters(
        filters
    )
    .outputOptions('-c:a copy')
    .output(config.tempLocation + 'final-1.mp4')
    .on('end', function() {
        console.log('Finished processing');
    })
    .on('error', function(err, stdout, stderr) {
        console.log('An error occurred: ' + err.message);
        console.log('ffmpeg stdout: ' + stdout);
        console.log('ffmpeg stderr: ' + stderr);
    })
    .run();

    await wait(50000)
}

// createCaptions("this is teh thing we have been all waiting for", 20, "", "")

