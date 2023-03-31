// import all the needed modules
import { Configuration, OpenAIApi } from "openai";
import wait from "wait";
import { config as con} from "../config.js";

let retry = 0
// main exported function to generate the images
export async function getImagePrompt(fact, gptPrompt) {

    if (retry > 3) {
        console.log("There is a problem with openAIAPI, retrying in 20 seconds")
        await wait(20000)
        retry = 0
        return getImagePrompt(fact, gptPrompt)
    }
    // create a new openai config to add to the openai api
    const config = new Configuration({apiKey: con.apiKeys.openAIAPI})
    const openai = new OpenAIApi(config);

    console.log("initilized the openai config...")
    // generate the prompt
    const proompt = await genPrompt(`${fact}: ${gptPrompt}`)
    let response;

    try {
        // generate a image
    response = await openai.createImage({
        prompt:`${proompt}, hyper-realistic`,
        n: 1,
        size: con.openAI.imageSize
    })
    console.log("Generated the image url")
    
   } catch(e) {

    console.log("Safety systems was triggered, retrying the geneartion")
    console.log(e.response.status)

    if (e.response.status == 400) {
        await getImagePrompt(fact, proompt + " .... this prompt creates 400 error in the dalle api, can you reformulate it sothat it does't trigger any safety systems by removing swear words, sensetive phrases and contreversial topic. Only return the newly generated prompt")
        return
    }

    if (e.response.status == 502) {
        await getImagePrompt(fact, proompt)
        retry += 1
    }

    if (e.response.status == 429) {
        await wait(10000)
    }
   }
    // return the image url for download
    console.log(response.data.data[0].url)
    return response.data.data[0].url
}

async function genPrompt(text) {    

    const config = new Configuration({apiKey: con.apiKeys.openAIAPI})
    const openai = new OpenAIApi(config);
    // generate a text prompt using the fact, that can generate a image
    const textProompt = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages: [{role: "user", content: text}]
    })

    // extract the output text of the request
    const proompt = textProompt.data.choices[0].message.content.replace(/[\r\n]/gm, '')
    console.log(`Generated Prompt for image\n prompt: ${proompt.slice(0, 15)}...`)
    return proompt
}

// getImagePrompt("sex tits porn pussy vagina", ` can you use this fact to generate a dall-e image prompt, only give the prompt and nothing else, dont include by "create a Dall-E image of..." or "Image prompt:" or anything indicating that it is a image prompt , and make sure it wont flag any safety systems`)