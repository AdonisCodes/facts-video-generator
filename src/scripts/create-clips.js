// import all the metadata
import { createRequire } from "module";
import wait from "wait";
import {config} from "../config.js"
const require = createRequire(import.meta.url)
var videoshow = require('videoshow')

// exported function to create the clips
export async function createClips(audioDur, temp, i) {
        console.log("creating clips")
        // array to specify where the is
        const images = [
            `${temp}${i}.png`
        ]

        // video options I copied of the internet
        var videoOptions = {
        fps: 25,
        loop:audioDur + config.tts.delayAfterSpeak, // seconds
        transition: false, // seconds
        videoBitrate: 1024,
        transitionDuration:0,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
        }

        // exporting the video
        const video = await new Promise((resolve, reject) => {
            videoshow(images, videoOptions)
            .size("1000x1000")
            .audio(`${temp}${i}.wav`)
            .save(config.tempLocation + `${i}.mp4`)
            .on('start', function (command) {
                console.log('ffmpeg process started... for video' + i)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
                reject()
            })
            .on('end', function (output) {
                console.error('Video ' + i + " created...", output)
                resolve()
            })

        })

    }

    // createClips(5, "./output/temp/0.png", "./output/temp/0.wav", 1)