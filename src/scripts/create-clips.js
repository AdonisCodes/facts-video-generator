import { createRequire } from "module";
import wait from "wait";
import {config} from "../config.js"
const require = createRequire(import.meta.url)
var videoshow = require('videoshow')


export async function createClips(audioDur, image, audio, i) {
        
        let images = [
            image
        ]

        var videoOptions = {
        fps: config.videoGeneration.fps,
        loop:audioDur + config.tts.delayAfterSpeak, // seconds
        transition: config.videoGeneration.transition, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
        }

        
        let video = videoshow(images, videoOptions)
        .size("1000x1000")
        .audio(`${audio}`)
        .save(config.tempLocation + `${i}.mp4`)
        .on('start', function (command) {
            console.log('ffmpeg process started... for video' + i)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Video ' + i + " created...", output)
        })
        await wait(20000)

    }