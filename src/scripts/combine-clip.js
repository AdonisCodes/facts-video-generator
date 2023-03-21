import ffmpeg from "fluent-ffmpeg";
import wait from "wait";

export async function combineClips(clipOutputPath) {
    let clips = ffmpeg()
        
    for (let i = 0; i < clipOutputPath.len; i++) {
        clips.addInput(`./output/temp/${i}.mp4`)
        console.log(i)
    }

    clips.mergeToFile("./output/temp/mask.mp4", "./output/temp")

    await wait(40000)
}

// combineClips({len: 3, path: "./output/temp"})