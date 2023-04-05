export const config = {
    tempLocation: "./output/temp/", // the location to save all the tem images
    description: "My socials; \n youtube => https://www.youtube.com/@delaywasntaken", // description to be added to the end of description of the video
    factsTotal: 1, // there is a error when choosing a fact total of more then 1, so only use 1
    
    apiKeys: {
        apiNinjaAPI: "", // https://www.api-ninajs.com
        openAIAPI: "", // https://platform.openai.com
    },
    
    tts: {
        voice: "Cellos", // the voice of the tts, nake sure the  voice is in your os tts engine, IDK how it really works
        delayAfterSpeak: 0.1, // the delay after the tts was done speaking
    },

    openAI: {
        imageSize: "256x256", // ? only 256x256, 512x512 and 1024x1024 is supported, the higher the quality the more credits is used when requesting image
    },

    videoGeneration: {
        fps: 25, // output fps
        transition: true, // the transition between images
        transitionDuration: 0.4, // the duration of the transition
        outputLocation: "./output/video-output/", // where to output the final result
        backgroundFootageLocation: "./output/background-videos/" // where the background videos are
    },

}