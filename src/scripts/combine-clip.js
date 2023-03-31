// import all the modules
import ffmpeg from "fluent-ffmpeg";
import wait from "wait";

// export the function to combine all the clips into one mask
export async function combineClips(clipOutputPath) {
  // initialize ffmpeg
  let clips = ffmpeg();

  // loop through the clips and add them to the clips.input()
  for (let i = 0; i < clipOutputPath.len; i++) {
    clips.addInput(`./output/temp/${i}.mp4`);
    console.log(`Clip ${i} added to the input...`);
  }

  // use ffmpeg.mergetofile() method and merge them into the final mask
  await new Promise((resolve, reject) => { 
    clips.mergeToFile("./output/temp/mask.mp4", "./output/temp")
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });

  // get the duration of the merged video
  const dur = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe("./output/temp/mask.mp4", (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });

  console.log(dur);
  return dur;
}

// combineClips({len: 1, path: "./output/temp"});
