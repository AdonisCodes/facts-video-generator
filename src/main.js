// Initilize main funciton
import { fetchFacts } from "./scripts/data_fetching.js";
import { getImagePrompt } from "./scripts/gen_image_prompt.js";
import { convertToTTS } from "./scripts/tts.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url)
var fs = require('fs'),
    request = require('request');

async function main() {
  let facts = await fetchFacts(1, "yf7Dn/+knNB2htA9qjGvKg==uFJOoL5XJpsoARSH");
  let vidData = [];
  
  for (let i = 0; i < facts.length; i++) {
    let ttsFilePath = convertToTTS(null, facts[i].fact, "/output/tts", i + 1);
    console.log(
      `Converting fact ${i + 1} out of ${facts.length} to audio and images`
      );
      let image = await getImagePrompt(facts[i].fact);
      download(image, `./output/${i}.png`, (e) => {console.log("image downloaded...")})
      
      vidData.push({ index: i + 1, image: `./output/${i}.png`, audio: ttsFilePath });
    }
  }

// main();

// util funcitons


function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



// let dur = 0

// const {getAudioDurationInSeconds } = require("get-audio-duration")
// getAudioDurationInSeconds("./output/tts/1.wav").then((duration) => {
//   dur = duration
//   console.log(duration)
// })

//   var ffmpeg  = require( 'fluent-ffmpeg' );
  
//   let newMp4 = ffmpeg();
//   newMp4
//       .input("./output/0.png")
//       .addInput('./output/tts/1.wav')
//       .save("./output/test.mp4")
//       .outputFPS(60) // Control FPS
//       .frames(dur * 60) // Control frame number
//       .on('end', () => {
//           console.log("done");
//       });