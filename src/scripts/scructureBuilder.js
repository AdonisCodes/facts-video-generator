import {createRequire} from "module"
import { download } from "../main.js"
let require = createRequire(import.meta.url)

const fs = require("fs/promises")

export async function createFolderStructure(outputDir) {
    // create the backgroundVideo folder
    try {
        await fs.mkdir(outputDir + "background-videos")
    } catch (err) {
        console.log("the directory already exists...")
    }

    // create the temp folder
    try {
        await fs.mkdir(outputDir + "temp")
    } catch (err) {
        console.log("the directory already exists...")
    }

    // create the video-output folder
    try {
        await fs.mkdir(outputDir + "video-output")
    } catch (err) {
        console.log("the directory already exists...")
    }


}