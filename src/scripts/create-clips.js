import { createRequire } from "module";
const require = createRequire(import.meta.url)
var videoshow = require('videoshow')


export async function createClips(audioDur, image, audio, i) {
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    sleep(10000).then(() => {
        
        let images = [
            image
        ]

        var videoOptions = {
        fps: 25,
        loop:audioDur + 0.5, // seconds
        transition: true,
        transitionDuration: 0, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
        }
        
        videoshow(images, videoOptions)
        .audio(`.${audio}`)
        .save(`./output/clip-output/${i}.mp4`)
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Video created in:', output)
        })
    });

}