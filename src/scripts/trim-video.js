import ffmpeg from "fluent-ffmpeg";
import wait from "wait";
import { config } from "../config.js";

export async function trim(len) {
    console.log(len)
    ffmpeg( config.tempLocation + "final-1.mp4")
    .seekInput(0)
    .duration(len)
    .output(config.videoGeneration.outputLocation + "final.mp4")
    .run()

    await wait(30000)
}

// trim(3)