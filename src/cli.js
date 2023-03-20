import {config} from "./config.js"
import { createRequire } from "module";
import { main } from "./main.js";
const require = createRequire(import.meta.url)
const prompt = require("prompt-sync")({sigint: true})

let input1 = prompt("Do you want to use the default config? 1=yes/0=no")

if (input1 == 0) {
    main()
}
