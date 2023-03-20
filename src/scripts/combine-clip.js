import ffmpeg from "fluent-ffmpeg";
import wait from "wait";

export async function combineClips(clipOutputPath) {
    let clips = ffmpeg()
        
    for (let i = 0; i < clipOutputPath.len; i++) {
        clips.addInput(`${clipOutputPath.path}/${i}.mp4`)
    }

    clips.mergeToFile("./output/temp/mask.mp4", "./output/temp")

    await wait(40000)
}

// combineClips({len: 4, path: "./output/clip-output"})