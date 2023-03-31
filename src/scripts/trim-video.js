import ffmpeg from "fluent-ffmpeg";
import wait from "wait";
import { config } from "../config.js";

export async function trim(len) {
    console.log(len)
    let trimmed = await new Promise((resolve, reject) => {
        ffmpeg( config.tempLocation + "final-1.mp4")
        .seekInput(0)
        .duration(len)
        .output(config.videoGeneration.outputLocation + "final.mp4")
        .on("end", () => {
            console.log("Successfully trimmed...")
            resolve()
        })
        .on("error", (e) => {
            console.log("an error has occurred" + e)
            reject()
        })
        .run()
        
    })

}

// trim(3)