// import all the modules
import ffmpeg from "fluent-ffmpeg";
import wait from "wait";

// export the function to combine all the clips into one mask
export async function combineClips(clipOutputPath) {
    // initialize ffmpeg
    let clips = ffmpeg()
    
    // loop through the clips and add them to the clips.input()
    for (let i = 0; i < clipOutputPath.len; i++) {
        clips.addInput(`./output/temp/${i}.mp4`)
        console.log(`Clip ${i} added to the input...`)
    }

    // use ffmpeg.mergetofile() method and merhe them into the final mask
    clips.mergeToFile("./output/temp/mask.mp4", "./output/temp")

    await wait(70000)

    let dur = ffmpeg.ffprobe("./output/temp/mask.mp4", (err, metadata) => {
        if (err) {
          console.error(err);
          return;
        }
        const duration = metadata.format.duration;
        return duration
      });
      
      console.log(dur)
      return dur
}

// combineClips({len: 1, path: "./output/temp"})