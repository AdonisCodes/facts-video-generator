// import modules
import say from "say";

// exported funciton to convert the facts to tts
export async function convertToTTS(voice, text, ttsSaveLocation, name) {
    
    // export and return the location of the tts
    say.export(text, voice, 1, `${ttsSaveLocation}${name}.wav`)
    console.log(`${ttsSaveLocation}${name}.wav`)
    return `${ttsSaveLocation}${name}.wav`
}