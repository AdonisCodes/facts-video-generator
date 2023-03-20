// Initilize main funciton
import { fetchFacts } from "./scripts/data_fetching.js";
import { getImagePrompt } from "./scripts/gen_image_prompt.js";
import { convertToTTS } from "./scripts/tts.js";
import { createRequire } from "module";
import { createClips } from "./scripts/create-clips.js";
import wait from "wait";
import { combineClips } from "./scripts/combine-clip.js";
import { addBackground } from "./scripts/background-footage-adder.js";
import { config } from "./config.js"
const require = createRequire(import.meta.url)
const { getAudioDurationInSeconds } = require("get-audio-duration")
var fs = require('fs'),
request = require('request');


export async function main() {
  let factsTotal = 3
  let facts = await fetchFacts(factsTotal, config.apiKeys.apiNinjaAPI);
  let vidData = [];
  
  for (let i = 0; i < facts.length; i++) {
    let ttsFilePath = convertToTTS(config.tts.voice, facts[i].fact, config.tempLocation, i + 1);
    console.log(`Converting fact ${i + 1} out of ${facts.length} to audio and images`);
    await wait(2000)

      let image = await getImagePrompt(facts[i].fact);
      await download(image, config.tempLocation + `${i}.png`, (e) => {console.log("image downloaded...")})
      
      vidData.push({ index: i + 1, image: config.tempLocation + `${i}.png`, audio: ttsFilePath });
      
    }

    
    for (let i = 0; i < vidData.length; i++) {
      
      let audioDur = await getAudioDurationInSeconds("./output/tts/1.wav").then((duration) => {
        return Math.ceil(duration)
      })

      createClips(audioDur, vidData[i].image, vidData[i].audio, i)
      await wait(15000)
    }
    
    console.log("Combining clips....")
    await wait(20000)

    combineClips({path: config.tempLocation, len: vidData.length})
    await wait(10000)
    addBackground()

  }

  

// main();

// util funcitons

async function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });

  await wait(10000)
};
