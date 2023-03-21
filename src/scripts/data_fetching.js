import axios from "axios"

export async function fetchFacts(factsTotal, apiKey) {
    const config = {
        headers: {"X-Api-Key": apiKey}
    }

    console.log("Fetching facts...")
    let facts = await axios.get(`https://api.api-ninjas.com/v1/facts?limit=${factsTotal}`, config)
    let result = await facts.data
    
    console.log(`Done fetching facts\n ${result[0].fact.slice(0, 10)}...`)
    return result
}