// Initilize main funciton
import { fetchFacts } from "./scripts/data_fetching.js";
import { getImagePrompt } from "./scripts/gen_image_prompt.js";
import { convertToTTS } from "./scripts/tts.js";
import { createRequire } from "module";
import { createClips } from "./scripts/create-clips.js";
const require = createRequire(import.meta.url)
const { getAudioDurationInSeconds } = require("get-audio-duration")
var fs = require('fs'),
request = require('request');


async function main() {
  let factsTotal = 2
  let facts = await fetchFacts(factsTotal, "yf7Dn/+knNB2htA9qjGvKg==uFJOoL5XJpsoARSH");
  let vidData = [];
  
  for (let i = 0; i < facts.length; i++) {
    let ttsFilePath = convertToTTS(null, facts[i].fact, "/output/tts", i + 1);
    console.log(`Converting fact ${i + 1} out of ${facts.length} to audio and images`);
    
      let image = await getImagePrompt(facts[i].fact);
      await download(image, `./output/images/${i}.png`, (e) => {console.log("image downloaded...")})
      
      vidData.push({ index: i + 1, image: `./output/images/${i}.png`, audio: ttsFilePath });
      
    }

    
    for (let i = 0; i < vidData.length; i++) {
      
      let audioDur = await getAudioDurationInSeconds("./output/tts/1.wav").then((duration) => {
        return Math.ceil(duration)
      })

      createClips(audioDur, vidData[i].image, vidData[i].audio, i)
    }
  }

  

main();

// util funcitons

async function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
