// import all the needed modules
import { Configuration, OpenAIApi } from "openai";
import { config as con} from "../config.js";

// main exported function to generate the images
export async function getImagePrompt(fact, gptPrompt) {

    // create a new openai config to add to the openai api
    const config = new Configuration({apiKey: con.apiKeys.openAIAPI})
    const openai = new OpenAIApi(config);

    console.log("initilized the openai config...")
    // generate the prompt
    let proompt = await genPrompt(`${fact}: ${gptPrompt}`)
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
    await getImagePrompt(fact, proompt + " .... this prompt creates 400 error in the dalle api, can you reformulate it sothat it does't trigger any safety systems by removing swear words, sensetive phrases and contreversial topic. Only return the newly generated prompt")
    return
   }
    // return the image url for download
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
    let proompt = textProompt.data.choices[0].message.content.replace(/[\r\n]/gm, '')
    console.log(`Generated Prompt for image\n prompt: ${proompt.slice(0, 15)}...`)
    return proompt
}

// getImagePrompt("coding is a skill", ` can you use this fact to generate a dall-e image prompt, only give the prompt and nothing else, dont include by "create a Dall-E image of..." or "Image prompt:" or anything indicating that it is a image prompt , and make sure it wont flag any safety systems`)