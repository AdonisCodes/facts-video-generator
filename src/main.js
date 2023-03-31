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
import { createCaptions } from "./scripts/createCaptions.js";
import { trim } from "./scripts/trim-video.js";
// Allow for require statements to be present in modules
const require = createRequire(import.meta.url)
const { getAudioDurationInSeconds } = require("get-audio-duration")
const fs = require('fs')
const request = require('request');
const path = require("path")

// initilize the main function
export async function main() {
  // define the facts total
  const factsTotal = config.factsTotal

  // await a request to the facts
  // * TODO: add a way to request the api key if it wasn't included in the config
  // * TODO: retry on errors if the error wasn't caused by user
  let facts = await fetchFacts(factsTotal, config.apiKeys.apiNinjaAPI);

  // print divider to make the console output more readable
  console.log("-----------------------")

  // declare the video data and metadata
  // used for other functions to have important information about the video.
  let vidData = [];
  let vidMetaData = [];
  const gptPrompt = ' can you use this fact to generate a dall-e image prompt, only give the prompt and nothing else, dont include by "create a Dall-E image of..." or "Image prompt:" or anything indicating that it is a image prompt , and make sure it wont flag any safety systems'

  // main loop to convert the facts into tts and to generate the images
  for (let i = 0; i < facts.length; i++) {
    // call the convert to tts function, and return the location of the saved tts.wav file
    const ttsFilePath = convertToTTS(config.tts.voice, facts[i].fact, config.tempLocation, i);
    console.log(`Converting fact ${i + 1} out of ${facts.length} to audio and images`);
    await wait(2000)

    // make a request to openai's apis to request images
    // * TODO: add a way to request the api key if it wasn't included in the config    
    const image = await getImagePrompt(facts[i].fact, gptPrompt);

    // use a stack overflow ctrl+c -> ctrl+v function; to download images to the temp location
    // * TODO: add a way to be 100% sure the image wa succesfully downloaded
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
    const audioDur = await getAudioDurationInSeconds(config.tempLocation + i + '.wav').then((duration) => {
      return Math.ceil(duration)
    })

      // use videoshow to combine the audio and photo clips into videos
      await createClips(audioDur, config.tempLocation, i)

      // divider to announce another action was successfully completed
      console.log("-----------------------")

    }
    
    // combine all the individual "fact clips" into one mask clip that can be used later
    console.log("Combining clips....")

    // * TODO: make the output path dynamic
    const mask = await combineClips({path: config.tempLocation, len: vidData.length})

    // add the background footage to the mask
    // * TODO: create a function to automatically extract a clip from a long video and use it as the background
    // * TODO: create a function to add the end screen to the video
    await addBackground()

    console.log("Creating Captions...")

    // add captions to the video
    let dur = 0
    let f = []
    for (let i = 0; i < facts.length; i++) {
      dur += await getAudioDurationInSeconds(config.tempLocation + i + ".wav")
      f.push(facts[i].fact)
    }
    await createCaptions(f.join(" "), mask,``, ``)

    await trim(mask)

    // divider to indicate the end of the end of a successfully action
    console.log("-----------------------")

    // generate the video title
    // * TODO: save the data to a metadata file in the output
    const vidTitle = await titleGenerator(`${facts[0].fact}`)
    vidMetaData.push(vidTitle)
    console.log(`Generated title\n ${vidTitle.slice(0, 25)}...\n`)
    console.log(vidTitle)
    
    // indicate the end of a successfully process
    console.log("-----------------------")

    // generate the video description
    // * TODO: save the data to a metadata file in the output
    const vidDesc = await descriptionGenerator(`${facts[0].fact}`, config.description)
    vidMetaData.push(vidDesc)
    console.log(`Generated description\n ${vidDesc.slice(0, 100)}...`)
    console.log(vidDesc)

    // to indicate the end of a successfully action
    console.log("-----------------------")
    console.log("Clearing temp....")

    fs.readdir(config.tempLocation, (err, file) => {
      for (const f of file) {
        fs.unlink(path.join(config.tempLocation, f), (e) => {
          return
        })
      }
    })

    console.log("Temp successfully cleared...")
  }

// call the main function
main();


// ! util functions
async function download(uri, filename){
  // IDK what is going on here, but it works!
  let image = await new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        resolve()
      })
   });
  })

};
