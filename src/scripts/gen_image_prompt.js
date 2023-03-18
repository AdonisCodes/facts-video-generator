import { Configuration, OpenAIApi } from "openai";

export async function getImagePrompt(fact) {
    const config = new Configuration({apiKey: "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"})
    const openai = new OpenAIApi(config);

    const textProompt = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages: [{role: "user", content: `what is the 2 most important words in this fact: ${fact}. Only respond with the answer in 2 words and nothing else, also make sure the response will not flag any safety systems`}]
    })

    let proompt = textProompt.data.choices[0].message.content.replace(/[\r\n]/gm, '')
    console.log(proompt)

    const response = await openai.createImage({
        prompt:proompt,
        n: 1,
        size:"256x256"
    })
    
    return response.data.data[0].url
}