// import all required modules
import axios from "axios"

// exported function to fetch all the facts
export async function fetchFacts(factsTotal, apiKey) {
    // the config needed to request data, more could be added but not needed
    const config = {
        headers: {"X-Api-Key": apiKey}
    }

    // using axios to fetch the facs
    console.log("Fetching facts...")
    let facts = await axios.get(`https://api.api-ninjas.com/v1/facts?limit=${factsTotal}`, config)

    // destructuring the facts to just return the array of facs
    let result = await facts.data
    
    console.log(`Done fetching facts\n ${result[0].fact.slice(0, 20)}...`)

    // returning the result
    return result
}