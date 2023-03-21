// import all the needed modules
import ffmpeg from "fluent-ffmpeg";
import wait from "wait";
import { config } from "../config.js";

// exported function to add background footage to the video
export async function addBackground() {
    // `1 hour of suffering and pain because my cp is slow, this took a very long time to create
    // there was some many errors that I almost gave up, there is still one more, and that is
    // that the audio doesnt play, I need to go into a video editor and click export, then the audio works when
    // I upload it to youtube, can you explain???
    
    ffmpeg(config.videoGeneration.backgroundFootageLocation + "1.mp4")
    .input(config.tempLocation + "mask.mp4")
    .videoCodec('libx264')
    .outputOptions('-pix_fmt yuv420p')
    .complexFilter([
        "[0:v]scale=1080:-1[bg];[bg][1:v]overlay=W-w-35:H-h-890"
    ])
    .addOutputOption(["-map 0:a"])
    .addOutputOption(["-map 1:a"])
    .audioCodec('aac')
    .outputOptions('-ab 128k')
    .output(config.videoGeneration.outputLocation + "final.mp4")
    .run()

    await wait(20000)
    console.log("Finally Done With Video...")
}

// addBackground()
