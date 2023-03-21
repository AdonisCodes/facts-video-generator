// Import all neccesary modules
import { fetchFacts } from "./scripts/data_fetching.js";
import { getImagePrompt } from "./scripts/gen_image_prompt.js";
import { convertToTTS } from "./scripts/tts.js";
import { createRequire } from "module";
import { createClips } from "./scripts/create-clips.js";
import wait from "wait";
import { combineClips } from "./scripts/combine-clip.js";
import { addBackground } from "./scripts/background-footage-adder.js";
import { config } from "./config.js"
import { descriptionGenerator, titleGenerator } from "./scripts/metaDataGen.js";

// Allow for require statements to be present in modules
const require = createRequire(import.meta.url)
const { getAudioDurationInSeconds } = require("get-audio-duration")
var fs = require('fs'),
request = require('request');


// initilize the main function
export async function main() {
  // define the facts total
  // * TODO: add facts total to the config file
  let factsTotal = 3

  // await a request to the facts
  // * TODO: add a way to request the api key if it wasn't included in the config
  // * TODO: retry on errors if the error wasn't caused by user
  let facts = await fetchFacts(factsTotal, config.apiKeys.apiNinjaAPI);

  // print divider to make the console output more readable
  console.log("-----------------------")

  // declare the video data and metadata
  // used for other functions to have important information about the video.
  let vidData = [];
  let vidMetaData = []

  // main loop to convert the facts into tts and to generate the images
  for (let i = 0; i < facts.length; i++) {
    // call the convert to tts function, and return the location of the saved tts.wav file
    let ttsFilePath = convertToTTS(config.tts.voice, facts[i].fact, config.tempLocation, i);
    console.log(`Converting fact ${i + 1} out of ${facts.length} to audio and images`);
    await wait(2000)

    // make a request to openai's apis to request images
    // * TODO: add a way to request the api key if it wasn't included in the config

    // * TODO: add a retry feature if the api safety systems were activated by requesting
    // * a newly generated prompt and retrying
    
    // * TODO: add a way to retry if any other erros come up
    let image = await getImagePrompt(facts[i].fact);

    // use a stack overflow ctrl+c -> ctrl+v function; to download images to the temp location
    await download(image, config.tempLocation + `${i}.png`, (e) => {console.log("image downloaded...")})
    
    // push the data of the images and tts location for further use
    vidData.push({ index: i + 1, image: config.tempLocation + `${i}.png`, audio: ttsFilePath });
    
    // divider to annoucne another action was succesfully completed
    console.log("-----------------------")

  }
  
  // main loop to convert the images and tts into seperate video files
  for (let i = 0; i < vidData.length; i++) {
    
    // use a nodejs module to get the duration of a audio file
    // this will be used to get the duration of image clip
    let audioDur = await getAudioDurationInSeconds(config.tempLocation + i + '.wav').then((duration) => {
      return Math.ceil(duration)
    })

      // use videowshow to combine the audio and photo clips into videos
      createClips(audioDur, config.tempLocation, i)
      await wait(15000)

      // divider to announse another action was succesfully completed
      console.log("-----------------------")

    }
    
    // combine all the individual "fact clips" into one mask clip that can be used later
    console.log("Combining clips....")
    await wait(20000)

    // * TODO: make the output path dynamic
    combineClips({path: config.tempLocation, len: vidData.length})
    await wait(10000)

    // add the background footage to the mask
    // * TODO: create a funciton to automatically extract a clip from a long video and use it as the background
    // * TODO: create a funciton to add the end screen to the video
    addBackground()
    await wait(25000)

    // divider to indicate the end of the end of a succesfull action
    console.log("-----------------------")

    // generate the video title
    // * TODO: save the data to a metadata file in the output
    let vidTitle = await titleGenerator(`${facts[0].fact}`)
    vidMetaData.push(vidTitle)
    console.log(`Generated title\n ${vidTitle.slice(0, 25)}...\n`)
    console.log(vidTitle)
    
    // indicate the end of a successfull process
    console.log("-----------------------")

    // generate the video description
    // * TODO: save the data to a metadata file in the output
    let vidDesc = await descriptionGenerator(`${facts[0].fact}`, config.description)
    vidMetaData.push(vidDesc)
    console.log(`Generated description\n ${vidDesc.slice(0, 100)}...`)
    console.log(vidDesc)

    // to indicate the end of a successfull action
    console.log("-----------------------")

  }

// call the main function
main();


// ! util funcitons
async function download(uri, filename, callback){
  // IDK what is going on here, but it works!
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });

  await wait(10000)
};
