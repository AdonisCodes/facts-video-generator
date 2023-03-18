import say from "say";

export function convertToTTS(voice, text, ttsSaveLocation, name) {
    say.export(text, voice, 1, `${ttsSaveLocation}/${name}.wav`, )
    return `${ttsSaveLocation}/${name}.wav`
}