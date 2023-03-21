import { Configuration, OpenAIApi } from "openai";
import { config } from "../config.js";

export async function titleGenerator(facts) {
    let con = new Configuration({apiKey: config.apiKeys.openAIAPI})
    let openai = new OpenAIApi(con)

    let textProompt = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[{role: "user", content: `can you use these facts to generate an appropriate tiktok title that contains the appropriate hastags,remove " and ' and from thre the response unless it will cause confusion to the reader, the title shoud not be longer than a sentence + the hastags, dont include any of the facts, make the title broad, add 2 emojis which associates with the text , give the respone only, and don't include any unnessesary data: ${facts}`}]
    })

    // console.log(textProompt.data.choices[0].message)
    return textProompt.data.choices[0].message.content.replace(/[\r\n]/gm, '')
}

export async function descriptionGenerator(facts, data) {
    let con = new Configuration({apiKey: config.apiKeys.openAIAPI})
    let openai = new OpenAIApi(con)

    let textProompt = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[{role: "user", content:`can you use these facts to generate an appropriate video description that contains hastags and video tags that are appropriate to the contents of the facts, dont include the facts or [fact] labels, only include a general description, also make sure to add the data that comes after the facts in a neat ordered fashion. facts: ${facts}. data: ${data}`}]
    })

    return textProompt.data.choices[0].message.content
}